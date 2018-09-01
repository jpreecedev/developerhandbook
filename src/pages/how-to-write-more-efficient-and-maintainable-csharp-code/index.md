---
layout: post
title: How to write more efficient and maintainable C# code
description: When you are writing your C# applications, you are aware that you want to make your applications as efficient, maintainable, and as scalable as possible.
date: 2013-08-23
categories: ['C#']
tags: ['c#', 'C#']
---

When you are writing your C# applications, you are aware that you want to make your applications as efficient, maintainable, and as scalable as possible. These are some great keywords that look great on blog posts like this, but how do you actually set about achieving this goal? We will look at some simply guidelines which try to make this goal more achievable.

### Write single purpose methods

Your methods should have a single purpose... a single task to perform. For example, a single method should not try to access a database, create objects, read text files, and create images. Instead, create a single method for each task. Why? Multipurpose methods are typically long, hard to read, difficult to maintain and inefficient.

**Pros:** Reduces reuse, improves readability and maintainability.

**Cons:** None

### Keep methods short

A method should be an absolute maximum of 50 lines long. Methods that are longer than this are typically multipurpose, which is bad. You want your code to be reusable where possible.

**Pros:** More maintainable code, which is more reusable.

**Cons:** None.

### Keep classes short

Classes should be no more than 300 lines long. If you have a "DocumentHelper" class which creates Microsoft Excel worksheets and calculates data based on data retrieved from an external database, consider splitting this into two classes (Excel Helper and ReportDataHelper)

**Pros:** Promotes reusability, helps keep classes short.

**Cons:** None.

### Don't have partial classes

Partial classes were introduced for Windows Forms applications to remove the initialisation logic from the main code behind file. Partial classes should not be used in any other scenario. Partial classes should not be used to reduce the length of your classes.

**Pros:** Partial classes are very difficult to navigate.

**Cons:** None.

### Resolve all build warnings

You shouldn't have any build warnings in your project. Build warnings typically lead to errors further down the line. Build warnings typically relate to missing references/assemblies. A good approach is to treat all build warnings as errors.
Open the project properties dialog, click the build tab, and change "Treat warnings as errors" to "All". This will also force you to clean up unused private member variables, which is always good.

### Avoid optional parameters

What: Optional parameters were introduced to improve COM interoperability. Example; When working with Microsoft Office COM interoperability assemblies, prior to optional parameters (and the dynamic keyword), it was necessary to pass in Type.Missing to all method parameters which you wanted to be the default (unsupplied) value. Old way;

```csharp
object excel;
object range = excel.get_Range("A1", "B4", 1, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing, Type.Missing);
```

This, as you can see its messy and very quickly becomes difficult to maintain. Now in newer versions of the Office Interop assemblies, all non-essential values are marked as optional, meaning you can simply write the following;

```csharp
object excel;
object range = excel.get_Range("A1", "B4", 1);
```

**Pros:** In some cases, optional parameters can dramatically reduce code complexity and length. Optional parameters can reduce the number of overloaded versions of the method, thus reducing code duplication.

**Cons:** Optional parameters are a compile time trick. This is actually no support for optional parameters in IL. So what happens when you compile? Take the following code snippet;

```csharp
public class OptionalParametersTest {
 public OptionalParametersTest() {
  LoadAllCustomers();
 }

 public void LoadAllCustomers(bool includeAddressDetails = false) {
  //Load customers
 }
}
```

What happens to this code at compile time? The value from the optional parameter is baked into the calling method, as follows;

```csharp
public class OptionalParametersTest {
 public OptionalParametersTest() {
  LoadAllCustomers(false);
 }

 public void LoadAllCustomers(bool includeAddressDetails) {
  //Load customers
 }
}
```

In this situation there is no problem. But in the case when the calling method is located in a separate assembly, this is an issue. If the default value is changed from false to true, and the calling assembly is not recompiled, then the calling method is out of sync. This is typically not an issue with websites, as you would normally redeploy the entire website; however, it's an issue with auto-updating desktop apps as they typically only patch the assemblies that have changed since the previous version.

### Remove unused code

If you have source control (such as TFS or GIT) ... use it! Remove code, don't delete it. It isn't gone forever! Your code can be easily retrieved at a later date.

### Reduce nesting

Nesting can reduce the complexity of code, its length and the depth of indention of your lines. The Microsoft coding standards suggest that we should return out of a method at the earliest possible time, for efficiency.

Bad:

```csharp
private void TryNotToNest(bool hasId) {
 if (hasId) {
  if (DateTime.Now > DateTime.Now.AddDays(-1)) {
   if (string.Equals(stringA, stringB)) {
    MessageBox.Show("Matched");
   }
  }
 }
}
```

Better:

```csharp
private void TryNotToNest(bool hasId) {
 if (hasId && DateTime.Now > DateTime.Now.AddDays(-1)) {
  if (string.Equals(stringA, stringB)) {
   MessageBox.Show("Matched");
  }
 }
}
```

Good:

```csharp
private void TryNotToNest(bool hasId) {
 if (!hasId) return;
 if (DateTime.Now <= DateTime.Now.AddDays(-1)) return;

 if (string.Equals(stringA, stringB)) {
  MessageBox.Show("Matched");
 }
}
```

Hopefully this will help you take a small step towards writing better code! :)
