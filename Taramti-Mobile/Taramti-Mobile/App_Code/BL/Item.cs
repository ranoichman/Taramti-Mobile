using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Item
{
    //fields
     UserT user;
     Item_Bid[] item_Bids;
     Item_Category[] item_Categories;
	 Picture[] pictures;

    //props
    #region
    public UserT User
    {
        get
        {
            return user;
        }

        set
        {
            user = value;
        }
    }

    public Item_Bid[] Item_Bids
    {
        get
        {
            return item_Bids;
        }

        set
        {
            item_Bids = value;
        }
    }

    public Item_Category[] Item_Categories
    {
        get
        {
            return item_Categories;
        }

        set
        {
            item_Categories = value;
        }
    }

    public Picture[] Pictures
    {
        get
        {
            return pictures;
        }

        set
        {
            pictures = value;
        }
    }
    #endregion

    //ctor
    public Item()
    {

    }

    //methods
    #region
    public void ShowItemImgs()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowItemCategories()
    {
        throw new System.Exception("Not implemented");
    }
    public void ShowItemDetails()
    {
        throw new System.Exception("Not implemented");
    }
    public void GetActiveItems()
    {
        throw new System.Exception("Not implemented");
    }
    public void GetItemDetails()
    {
        throw new System.Exception("Not implemented");
    }
    #endregion

}
