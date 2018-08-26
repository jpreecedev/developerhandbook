---
layout: post
title: Quick look - Add indexes to tables with Entity Framework 6.1 Beta 1
date: 2014-02-26
tags: ['c#', 'entity framework', 'Entity Framework', 'sql server']
---

At the time of writing, beta 1 of Entity Framework 6.1 has recently been released. This is [mostly a maintenance release](http://blogs.msdn.com/b/adonet/archive/2014/02/11/ef-6-1-0-beta-1-available.aspx), however, there are several new feature of note, including the ability to add indexes using a new data annotation when developing using the code first approach.

### Add indexes using the Index attribute

To add an index, simply add the Index attribute as required; [code language="csharp"] public class Customer { [Index] public int Id { get; set; } } [/code] A quick look in SQL Server Management studio reveals that the index has been added for us. [![image](image_thumb11.png 'image')](https://developerhandbook.com/wp-content/uploads/2014/02/image11.png) The key created was non-unique, non-clustered. There are overloads available to override these defaults; [code language="csharp"][index(isclustered = false, isunique = true)] public int Id { get; set; } [/code] Which results in a unique index as shown below; [![indexes](indexes_thumb1.png 'indexes')](https://developerhandbook.com/wp-content/uploads/2014/02/indexes1.png)

### Summary

This is a fantastic new feature for potentially improving the performance of your code first applications by reducing the time required to query data. You can add indexes to your database using the **Index** attribute, and override the default **Unique** and **Clustered** settings to get the index best suited to your scenario.
