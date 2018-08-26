---
layout: post
title: 5 AutoMapper tips and tricks
date: 2014-08-23
tags: ["Architecture","AutoMapper","c#","C#"]
---

[AutoMapper](https://github.com/AutoMapper/AutoMapper) is a productivity tool designed to help you write less repetitive code mapping code. AutoMapper maps objects to objects, using both convention and configuration.  AutoMapper is flexible enough that it can be overridden so that it will work with even the oldest legacy systems.  This post demonstrates what I have found to be 5 of the most useful, lesser known features. **Tip:** I wrote unit tests to demonstrate each of the basic concepts.  If you would like to learn more about unit testing, please check out my post [C# Writing Unit Tests with NUnit And Moq](https://www.developerhandbook.com/2013/08/30/csharp-writing-unit-tests-with-nunit-and-moq/). [embed]http://youtu.be/JVc5udgEaLY?a[/embed]

## Demo project code

This is the basic structure of the code I will use throughout the tutorial;

    public class Doctor
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class HealthcareProfessional
    {
        public string FullName { get; set; }
    }

    public class Person
    {
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }

    public class KitchenCutlery
    {
        public int Knifes { get; set; }
        public int Forks { get; set; }
    }

    public class Kitchen
    {
        public int KnifesAndForks { get; set; }
    }

    public class MyContext : DbContext
    {
        public DbSet<Doctor> Doctors { get; set; }
    }

    public class DbInitializer : DropCreateDatabaseAlways<MyContext>
    {
        protected override void Seed(MyContext context)
        {
            context.Doctors.Add(new Doctor
            {
                FirstName = "Jon",
                LastName = "Preece",
                Title = "Mr"
            });
        }
    }

I will refer back to this code in each example.

## AutoMapper Projection

No doubt one of the best, and probably least used features of AutoMapper is projection.  AutoMapper, when used with an Object Relational Mapper (ORM) such as Entity Framework, can cast the source object to the destination type at database level. This may result in more efficient database queries. AutoMapper provides the `Project` extension method, which extends the `IQueryable` interface for this task.  This means that the source object does not have to be fully retrieved before mapping can take place. Take the following unit test;

    [Test]
    public void Doctor_ProjectToPerson_PersonFirstNameIsNotNull()
    {
        //Arrange
        Mapper.CreateMap<Doctor, Person>()
                .ForMember(dest => dest.LastName, opt => opt.Ignore());

        //Act
        Person result;
        using (MyContext context = new MyContext())
        {
            context.Database.Log += s => Debug.WriteLine(s);
            result = context.Doctors.Project().To<Person>().FirstOrDefault();
        }

        //Assert
        Assert.IsNotNull(result.FirstName);
    }

The query that is created and executed against the database is as follows;

    SELECT TOP (1) 
        [d].[Id] AS [Id], 
        [d].[FirstName] AS [FirstName]
        FROM [dbo].[Doctors] AS [d]

Notice that `LastName` is not returned from the database?  This is quite a simple example, but the potential performance gains are obvious when working with more complex objects.

<table style="margin-right: auto; margin-left: auto;" border="0" width="500" cellspacing="0" cellpadding="10">

<tbody>

<tr>

<td valign="top" width="500">[![InstantAutoMapper](InstantAutoMapper_thumb.png "InstantAutoMapper")](https://www.developerhandbook.com/wp-content/uploads/2014/08/InstantAutoMapper.png)**<span style="font-size: small;">Recommended Further Reading:</span>** [**<span style="font-size: small;">Instant AutoMapper</span>**](http://www.amazon.co.uk/gp/product/B00E7NCAPE/ref=as_li_tl?ie=UTF8&camp=1634&creative=6738&creativeASIN=B00E7NCAPE&linkCode=as2&tag=jprecom-21)<span style="font-size: small;">![](ir?t=jprecom-21&l=as2&o=2&a=B00E7NCAPE) </span> <span style="font-size: small;">Automapper is a simple library that will help eliminate complex code for mapping objects from one to another. It solves the deceptively complex problem of mapping objects and leaves you with clean and maintainable code.</span> <span style="font-size: small;">Instant Automapper Starter is a practical guide that provides numerous step-by-step instructions detailing some of the many features Automapper provides to streamline your object-to-object mapping. Importantly it helps in eliminating complex code.</span></td>

</tr>

</tbody>

</table>

## Configuration Validation

Hands down the most useful, time saving feature of AutoMapper is Configuration Validation.  Basically after you set up your maps, you can call `Mapper.AssertConfigurationIsValid()` to ensure that the maps you have defined make sense.  This saves you the hassle of having to run your project, navigate to the appropriate page, click button A/B/C and so on to test that you mapping code actually _works_. Take the following unit test;

    [Test]
    public void Doctor_MapsToHealthcareProfessional_ConfigurationIsValid()
    {
        //Arrange
        Mapper.CreateMap<Doctor, HealthcareProfessional>();

        //Act

        //Assert
        Mapper.AssertConfigurationIsValid();
    }

AutoMapper throws the following exception;

<pre>AutoMapper.AutoMapperConfigurationException : 
Unmapped members were found. Review the types and members below.
Add a custom mapping expression, ignore, add a custom resolver, or modify the source/destination type
===================================================================
Doctor -> HealthcareProfessional (Destination member list)
MakingLifeEasier.Doctor -> MakingLifeEasier.HealthcareProfessional (Destination member list)
-------------------------------------------------------------------
FullName
</pre>

AutoMapper can't infer a map between `Doctor` and `HealthcareProfessional` because they are structurally very different.  A custom converter, or `ForMember` needs to be used to indicate the relationship;

    [Test]
    public void Doctor_MapsToHealthcareProfessional_ConfigurationIsValid()
    {
        //Arrange
        Mapper.CreateMap<Doctor, HealthcareProfessional>()
              .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => string.Join(" ", src.Title, src.FirstName, src.LastName)));

        //Act

        //Assert
        Mapper.AssertConfigurationIsValid();
    }

The test now passes because every public property now has a valid mapping.

## Custom Conversion

Sometimes when the source and destination objects are too different to be mapped using convention, and simply too big to write elegant inline mapping code (`ForMember`) for each individual member, it can make sense to do the mapping yourself.  AutoMapper makes this easy by providing the `ITypeConverter<TSource, TDestination>` interface. The following is an implementation for mapping `Doctor` to a `HealthcareProfessional`;

    public class HealthcareProfessionalTypeConverter : ITypeConverter<Doctor, HealthcareProfessional>
    {
        public HealthcareProfessional Convert(ResolutionContext context)
        {
            if (context == null '' context.IsSourceValueNull)
                return null;

            Doctor source = (Doctor)context.SourceValue;

            return new HealthcareProfessional
            {
                FullName = string.Join(" ", new[] { source.Title, source.FirstName, source.LastName })
            };
        }
    }

You instruct AutoMapper to use your converter by using the `ConvertUsing` method, passing the type of your converter, as shown below;

    [Test]
    public void Legacy_SourceMappedToDestination_DestinationNotNull()
    {
        //Arrange
        Mapper.CreateMap<Doctor, HealthcareProfessional>()
                .ConvertUsing<HealthcareProfessionalTypeConverter>();

        Doctor source = new Doctor
        {
            Title = "Mr",
            FirstName = "Jon",
            LastName = "Preece",
        };

        Mapper.AssertConfigurationIsValid();

        //Act
        HealthcareProfessional result = Mapper.Map<HealthcareProfessional>(source);

        //Assert
        Assert.IsNotNull(result);
    }

AutoMapper simply hands over the source object (`Doctor`) to you, and you return a new instance of the destination object (`HealthcareProfessional`), with the populated properties.  I like this approach because it means I can keep all my <span style="text-decoration: line-through;">monkey</span> mapping code in one single place.

## Value Resolvers

Value resolves allow for correct mapping of value types.  The source object `KitchenCutlery` contains a precise breakdown of the number of knifes and forks in the kitchen, whereas the destination object `Kitchen` only cares about the sum total of both.  AutoMapper won't be able to create a convention based mapping here for us, so we use a Value (type) Resolver;

    public class KitchenResolver : ValueResolver<KitchenCutlery, int>
    {
        protected override int ResolveCore(KitchenCutlery source)
        {
            return source.Knifes + source.Forks;
        }
    }

The value resolver, similar to the type converter, takes care of the mapping and returns a result, but notice that it is specific to the individual property, and not the full object. The following code snippet shows how to use a Value Resolver;

    [Test]
    public void Kitchen_KnifesKitchen_ConfigurationIsValid()
    {
        //Arrange

        Mapper.CreateMap<KitchenCutlery, Kitchen>()
                .ForMember(dest => dest.KnifesAndForks, opt => opt.ResolveUsing<KitchenResolver>());

        //Act

        //Assert
        Mapper.AssertConfigurationIsValid();
    }

## Null Substitution

Think _default values_.  In the event that you want to give a destination object a default value when the source value is `null`, you can use AutoMapper's `NullSubstitute` feature. Example usage of the `NullSubstitute` method, applied individually to each property;

    [Test]
    public void Doctor_TitleIsNull_DefaultTitleIsUsed()
    {
        //Arrange
        Doctor source = new Doctor
        {
            FirstName = "Jon",
            LastName = "Preece"
        };

        Mapper.CreateMap<Doctor, Person>()
                .ForMember(dest => dest.Title, opt => opt.NullSubstitute("Dr"));

        //Act
        Person result = Mapper.Map<Person>(source);

        //Assert
        Assert.AreSame(result.Title, "Dr");
    }

## Summary

AutoMapper is a productivity tool designed to help you write less repetitive code mapping code.  You don't have to rewrite your existing code or write code in a particular style to use AutoMapper, as AutoMapper is flexible enough to be configured to work with even the oldest legacy code.  Most developers aren't using AutoMapper to its full potential, rarely straying away from `Mapper.Map`.  There are a multitude of useful tidbits, including; Projection, Configuration Validation, Custom Conversion, Value Resolvers and Null Substitution, which can help simplify complex logic when used correctly.