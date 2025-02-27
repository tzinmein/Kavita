﻿using System.Collections.Generic;
using API.Entities;

namespace API.Helpers;

public static class OrderableHelper
{
    public static void ReorderItems(List<AppUserDashboardStream> items, int itemId, int toPosition)
    {
        var item = items.Find(r => r.Id == itemId);
        if (item != null)
        {
            items.Remove(item);
            items.Insert(toPosition, item);
        }

        for (var i = 0; i < items.Count; i++)
        {
            items[i].Order = i;
        }
    }

    public static void ReorderItems(List<AppUserSideNavStream> items, int itemId, int toPosition)
    {
        var item = items.Find(r => r.Id == itemId);
        if (item != null)
        {
            items.Remove(item);
            items.Insert(toPosition, item);
        }

        for (var i = 0; i < items.Count; i++)
        {
            items[i].Order = i;
        }
    }

    public static void ReorderItems(IList<AppUserSideNavStream> items)
    {
        for (var i = 0; i < items.Count; i++)
        {
            items[i].Order = i;
        }
    }

    public static void ReorderItems(List<ReadingListItem> items, int readingListItemId, int toPosition)
    {
        var item = items.Find(r => r.Id == readingListItemId);
        if (item != null)
        {
            items.Remove(item);
            items.Insert(toPosition, item);
        }

        for (var i = 0; i < items.Count; i++)
        {
            items[i].Order = i;
        }
    }
}
