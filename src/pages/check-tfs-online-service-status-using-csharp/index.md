---
layout: post
title: Check TFS Online service status using C#
description:  I have written a little screen scraping tool based on the HTML Agility Pack that will scrape the service status page and report back the current status.
date: 2014-01-10
categories: ['C#', '.NET']
featuredImage: ''
---

If you use TFS Online you may have experienced some unexpected downtime over the last few months. Whilst the service is getting better and better all the time, downtime is still an issue. I have written a little screen scraping tool based on the [HTML Agility Pack](http://htmlagilitypack.codeplex.com/ 'HTML Agility Pack') that will scrape the service status page and report back the current status. Add the following class to your project;

```csharp
using HtmlAgilityPack;

/// <summary>
/// The TFS heartbeat helper.
/// </summary>
public static class TFSHeartbeatHelper {
  #region Constants

  /// <summary>
  /// The service status url.
  /// </summary>
  private const string ServiceStatusUrl = "http://www.visualstudio.com/en-us/support/support-overview-vs.aspx";

  #endregion

  #region Public Methods and Operators

  /// <summary>
  /// Gets the TFS service status
  /// </summary>
  /// <returns>
  /// The <see cref="ServiceStatus"/>.
  /// </returns>
  public static ServiceStatus GetStatus() {
    HtmlDocument doc = new HtmlWeb().Load(ServiceStatusUrl);

    HtmlNode detailedImage = doc.DocumentNode.SelectSingleNode("//div[@class='DetailedImage']");
    HtmlNode supportImageNode = detailedImage.ChildNodes.FindFirst("img");

    if (supportImageNode.Id == "Support_STATUS_Check") {
      return ServiceStatus.NoIssues;
    }

    if (supportImageNode.Id == "Support_STATUS_Exclamation_Y") {
      return ServiceStatus.Issues;
    }

    return ServiceStatus.Undetermined;
  }

 #endregion
}

/// <summary>
/// The service status.
/// </summary>
public enum ServiceStatus {

  /// <summary>
  /// No issues.
  /// </summary>
  NoIssues,

  /// <summary>
  /// There are issues.
  /// </summary>
  Issues,

  /// <summary>
  /// Unable to determine the status
  /// </summary>
  Undetermined
}
```

The usage for this code is as follows;

```csharp
switch (TFSHeartbeatHelper.GetStatus()) {
 case ServiceStatus.NoIssues: ////Good news!
   break;
 case ServiceStatus.Issues: ////Bad news!
   break;
 case ServiceStatus.Undetermined: ////Erm..not sure :S
   break;
}
```

I hope you find this little helper useful. Please leave a comment below.
