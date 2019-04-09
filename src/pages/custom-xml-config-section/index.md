---
layout: post
title: C# Create a custom XML configuration section
description: This post looks at how you can create a configuration settings section to help simplify configuration management.
date: 2013-12-21
categories: ['C#', '.NET']
group: 'Software Development'
---

It is common when developing either Desktop or Web based applications to need to persist settings in an easily updateable location. Developers often choose to add normal application settings in the form of key value pairs, as shown below, and this is a great approach when you only have a small number of settings. However, as your applications configuration becomes more complicated, this approach soon becomes hard for the developer and end user alike. This blog post looks at how you can create a configuration settings section to help ease this problem.

### Simple approach

If you want to take the more conventional approach to making your application configurable, you could create a list of key value pairs in the `appSettings` section of your application configuration file;

```xml
<appSettings>
	<add key="workspaceName" value="$machineName$"/>
	<add key="username" value="jonpreece"/>
	<add key="machineName" value="$machineName$"/>
	<add key="teamProjectPath" value="https://jpreecedev.visualstudio.com/DefaultCollection"/>
</appSettings>
```

You then access these settings via the [ConfigurationManager](<http://msdn.microsoft.com/en-us/library/system.configuration.configurationmanager(v=vs.110).aspx> 'ConfigurationManager') class;

```csharp
var workspaceName = ConfigurationManager.AppSettings["workspaceName"];
```

### An alternative approach - Configuration sections

Configuration sections give our XML more structure. Take the following example;

```xml
<DeveloperConfiguration>
	<tfs workspaceName="$machineName$" username="jonpreece" machineName="$machineName$" teamProjectPath="https://jpreecedev.visualstudio.com/DefaultCollection"/>
</DeveloperConfiguration>
```

The best approach to structuring your C# code is to copy each configuration section/element with matching C# code files. Starting with `DeveloperConfiguration`, create a new class with the same name and derive it from `ConfigurationSection`, as follows;

```csharp
public sealed class DeveloperConfiguration : ConfigurationSection { }
```

Unfortunately instantiating the class and accessing its properties/methods directly doesn't work, so a common approach is to make your class a singleton and call `ConfigurationManager.GetSection` to load the section into memory.

```csharp
public sealed class DeveloperConfiguration: ConfigurationSection {
 private static readonly DeveloperConfiguration _instance = (DeveloperConfiguration) ConfigurationManager.GetSection("DeveloperConfiguration");

 public static DeveloperConfiguration Instance {
  get {
   return _instance;
  }
 }
}
```

You can map child elements within your configuration section using the `ConfigurationProperty` attribute;

```csharp
[ConfigurationProperty("tfs", IsRequired = true)]
public Tfs Tfs {
 get {
  return (Tfs) this["tfs"];
 }
}
```

There are several named properties you can use here. In the above example, the `IsRequired` property states that the property must be present, or an exception will be thrown. To access the **Tfs** configuration element, create a new class that derives from the `ConfigurationElement` class, as shown below;

```csharp
public class Tfs: ConfigurationElement {
 [ConfigurationProperty("workspaceName", IsRequired = true)]
 public string WorkspaceName {
  get {
   return ReplaceMacros((string) this["workspaceName"]);
  }
 }
}
```

You can then access its properties using the `ConfigurationProperty` attribute, as previously discussed. Usage is now straightforward;

```csharp
private static readonly Tfs _configuration = DeveloperConfiguration.Instance.Tfs;
static TFSHelper() {
 _teamProject = TfsTeamProjectCollectionFactory.GetTeamProjectCollection(new Uri(_configuration.TeamProjectPath));
 _service = _teamProject.GetService<VersionControlServer>();
}
```

### Summary

You can take a simple approach to making your application more configurable by using key-value-pairs and accessing them directly using the `ConfigurationManager`. Alternatively, you can create a configuration section, which is more verbose, structured, easier to read and more maintainable. Create a class that derives from `ConfigurationSection`, ideally with the same name as your section in XML.
