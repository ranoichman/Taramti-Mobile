using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Item
{
    //fields
    UserT user;
    int itemId;
    string itemName;
    string itemDesc;
    City location;
    Item_Bid[] item_Bids;
    Item_Category item_Category;
    string[] pictures;

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

    public Item_Category Item_Categories
    {
        get
        {
            return item_Category;
        }

        set
        {
            item_Category = value;
        }
    }

    public string[] Pictures
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

    public string ItemName
    {
        get
        {
            return itemName;
        }

        set
        {
            itemName = value;
        }
    }

    public string ItemDesc
    {
        get
        {
            return itemDesc;
        }

        set
        {
            itemDesc = value;
        }
    }

    public City Location
    {
        get
        {
            return location;
        }

        set
        {
            location = value;
        }
    }

    public int ItemId
    {
        get
        {
            return itemId;
        }

        set
        {
            itemId = value;
        }
    }
    #endregion

    //ctor
    public Item()
    {

    }

    public Item(string itemName, string itemDesc)
    {
        this.itemName = itemName;
        this.itemDesc = itemDesc;
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

    public bool AddPictures()
    {
        for (int i = 0; i < Pictures.Length; i++)
        {

            string sqlInsert = @"INSERT INTO[dbo].[product_pictures]
                               ([product_code] ,[pic_code] ,[path])
                                VALUES
                               (@ProductCode ,@PicCode ,@Path)";

            DbService db = new DbService();
            SqlParameter parProductCode = new SqlParameter("@ProductCode", ItemId);
            SqlParameter parPicCode = new SqlParameter("@PicCode", i);
            SqlParameter parPath = new SqlParameter("@Path", Pictures[i]);

            if (db.ExecuteQuery(sqlInsert, CommandType.Text, parProductCode, parPicCode, parPath) == 0)
            {
                return false;
            }
        }
        return true;
    }

    public bool AddItem(int seller)
    {
        string sqlInsert = @"INSERT INTO [dbo].[product]
           ([product_description]
           ,[product_category_code]
           ,[city_code]
           ,[seller_id]
           ,[product_Name])
     VALUES
           (@ProductDesc, @ProductCatCode, @ProductCity, @ProductSeller, @ProductName)";

            DbService db = new DbService();
        SqlParameter parProdDesc = new SqlParameter("@ProductDesc", ItemDesc);
        SqlParameter parProdCatCode = new SqlParameter("@ProductCatCode", Item_Categories.Cat_id);
        SqlParameter parProdCity = new SqlParameter("@ProductCity", Location.CityCode);
        SqlParameter parProdSeller = new SqlParameter("@ProductSeller", seller);
        SqlParameter parProdName = new SqlParameter("@ProductName", ItemName);

        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parProdDesc, parProdCatCode, parProdCity, parProdSeller, parProdName) == 0)
            {
                return false;
            }
        return true;
    }

}

    #endregion


