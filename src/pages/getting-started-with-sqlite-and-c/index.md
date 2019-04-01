---
layout: post
title: Getting started with SQLite and C#
description: SQLite is a powerful, extremely light-weight transactional SQL database provider. SQLite is cross platform and runs on multiple architectures.
date: 2013-08-07
categories: ['C#', '.NET']
featuredImage: ''
---

SQLite is a powerful, extremely light-weight transactional SQL database provider. SQLite is free and open source, and it does not require any server processes to handle it. SQLite is cross platform and runs on multiple architectures, making it ideal for use on the major operating systems such as Windows, Mac OS, Linux, and even lower powered devices such as PDAs, MP3 players etc.

### Prerequisites

It is possible to get up and running with SQLite quickly in C#, by adding the [System.Data.SQLite](http://www.nuget.org/packages/System.Data.SQLite 'System.Data.SQLite') package to your project. Open the package manager console window run the following;

```powershell
Install-package System.Data.SQLite
```

Or alternatively, right click your project and click _Manage NuGet Packages_ and search the online gallery for _System.Data.SQLite_.

### A Helpful Wrapper Class

I have put together a _very_ simple wrapper class that will get you up and running quickly. Here it is;

```csharp
public class SQLiteDatabase {
 private readonly string _dbConnection;

 public SQLiteDatabase(string dataSource) {
  _dbConnection = string.Format("Data Source={0}", dataSource);
 }

 public DataTable GetDataTable(SQLiteCommand command) {
  if (command == null) throw new ArgumentNullException("command");

  using(SQLiteConnection connection = new SQLiteConnection(_dbConnection)) {
   connection.Open();
   command.Connection = connection;

   using(SQLiteDataReader reader = command.ExecuteReader()) {
    DataTable result = new DataTable();
    result.Load(reader);
    return result;
   }
  }
 }

 public SQLiteCommand GetCommand(string sql) {
  if (string.IsNullOrEmpty(sql))
   throw new ArgumentNullException("sql");

  return new SQLiteCommand {
   CommandText = sql, CommandType = CommandType.Text
  };
 }

 public int ExecuteNonQuery(SQLiteCommand command) {
  if (command == null) throw new ArgumentNullException("command");

  using(SQLiteConnection connection = new SQLiteConnection(_dbConnection)) {
   connection.Open();
   command.Connection = connection;

   return command.ExecuteNonQuery();
  }
 }
}
```

This wrapper is loosely based on some code written by [Mike Duncan](http://www.mikeduncan.com/ 'Mike Duncan').

### Usage

The constructor takes the database path (the extension is completely up to you);

```csharp
SQLiteDatabase database = new SQLiteDatabase("Customers.db");
```

To execute a standard non query command, you first create your command and call the `ExecuteNonQuery` method;

```csharp
SQLiteCommand create = database.GetCommand("CREATE TABLE Customers (Id int PRIMARY KEY, Name nvarchar(256), Address nvarchar(256), PostCode nvarchar(256))");
database.ExecuteNonQuery(create);
SQLiteCommand populate = database.GetCommand("INSERT INTO Customers ('Id', 'Name', 'Address', 'PostCode') VALUES (1, 'Jon Preece', 'My House', 'NN11NN')");
int affected = database.ExecuteNonQuery(populate);
```

You can retrieve data from the database in the form of the timeless `DataTable` object;

```csharp
SQLiteCommand a = database.GetCommand("SELECT * FROM Customers");
DataTable res = database.GetDataTable(a);
```

### Summary

SQLite gives us the ability to write extremely light-weight databases, that have no dependence on third party products or servers. In order to properly utilise SQLite in all but the simplest applications, a major investment would be required to write additional architectural code to load SQL from external SQL files, so as to avoid writing in-line SQL. If you want to browse your SQLite database, you'll need the [SQLite Browser from Sourceforge](http://sourceforge.net/projects/sqlitebrowser/ 'SQLite Browser').
