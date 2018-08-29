---
layout: post
title: Entity Framework - Use a Guid as the primary key
date: 2014-07-13
categories: ['Entity Framework']
tags: ['entity framework', 'Entity Framework']
---

Using a Guid as your tables primary key, when using Entity Framework, requires a little more effort than when using a integer. The setup process is straightforward, after you've read/been shown how to do it. The process is slightly different for the Code First and Database First approaches. This post discusses both techniques.

## Code First

Using a Guid as the primary key when taking the code first approach is simple. When creating your entity, add the [DatabaseGenerated](<http://msdn.microsoft.com/en-us/library/system.componentmodel.dataannotations.schema.databasegeneratedattribute(v=vs.110).aspx> 'DatabaseGeneratedAttribute') attribute to your primary key property, as shown below;

```csharp
[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
public Guid Id { get; set; }
```

Entity framework will create the column as you would expect, with a primary key and `uniqueidentifier` data type. [<figure>![codefirst-defaultvalue](codefirst-defaultvalue_thumb1.png 'codefirst-defaultvalue')

<figcaption>Click to zoom in</figcaption>

</figure>](codefirst-defaultvalue1.png) Also notice, very important, that the default value on the column has been set to `(newsequentialid())`.  This generates a new sequential (continuous) Guid for each row.  If you were so inclined, you could change this to `newid())`, which would result in a completely random Guid for each new row.  This will be cleared each time your database gets dropped and re-created, so this works better when taking the Database First approach.

## Database First

The database first approach follows a similar line to the code first approach, but you'll have to manually edit your model to make it work. Ensure that you edit the primary key column and add the `(newsequentialid())` or `(newid())` function as the default value before doing anything. Next, open you EDMX diagram, select the appropriate property and open the properties window. Ensure that **StoreGeneratedPattern** is set to identity. [<figure>![databasefirst-model](databasefirst-model_thumb1.png 'databasefirst-model')

<figcaption>Click the image to zoom in</figcaption>

</figure>](databasefirst-model1.png) No need to give your entity an ID in your code, that will be populated for you automatically after the entity has been commited to the database;

```csharp
using (ApplicationDbContext context = new ApplicationDbContext())
{
    var person = new Person
                      {
                          FirstName = "Random",
                          LastName = "Person";
                      };

    context.People.Add(person);
    context.SaveChanges();
    Console.WriteLine(person.Id);
}
```

**Important Note: Your Guid field MUST be a primary key, or this does not work. Entity Framework will give you a rather cryptic error message!**

## Summary

Guid (Globally Unique Identifiers) can easily be used as primary keys in Entity Framework. A little extra effort is required to do this, depending on which approach you are taking. When using the code first approach, add the `DatabaseGenerated` attribute to your key field. When taking the Database First approach, explicitly set the **StoredGeneratedPattern** to **Identity** on your model.
