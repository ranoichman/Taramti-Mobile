using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Item_Category
{
    //fields
    int cat_id;
    string cat_Name;
    Item[] items;

    //props
    #region
    public int Cat_id
    {
        get
        {
            return cat_id;
        }

        set
        {
            cat_id = value;
        }
    }

    public string Cat_Name
    {
        get
        {
            return cat_Name;
        }

        set
        {
            cat_Name = value;
        }
    }

    public Item[] Items
    {
        get
        {
            return items;
        }

        set
        {
            items = value;
        }
    }
    #endregion

    //ctor
    public Item_Category()
    {

    }

    //methods
    #region
    public void GetCatItems()
    {
        throw new System.Exception("Not implemented");
    }
    #endregion
}
