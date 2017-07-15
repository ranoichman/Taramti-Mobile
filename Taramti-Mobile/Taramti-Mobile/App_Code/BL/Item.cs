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
    string price;
    List<FAQ> questions;

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

    public string Price
    {
        get
        {
            return price;
        }

        set
        {
            price = value;
        }
    }

    public List<FAQ> Questions
    {
        get
        {
            return questions;
        }

        set
        {
            questions = value;
        }
    }
    #endregion

    //ctor
    public Item()
    {
        Questions = new List<FAQ>();
    }

    public Item(int id)
    {
        ItemId = id;
    }

    public Item(string itemName, string itemDesc)
    {
        ItemName = itemName;
        ItemDesc = itemDesc;
        Questions = new List<FAQ>();
    }

    //methods
    #region

    public void GetAllQuestions()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Item_Category> allCat = new List<Item_Category>();
        string StrSql = @"SELECT        dbo.product_FAQ.*
                        FROM            dbo.product_FAQ
                        WHERE        (product_code = @prodID)";
        SqlParameter parID = new SqlParameter("@prodID", ItemId);
        DS = db.GetDataSetByQuery(StrSql, CommandType.Text, parID);

        if (DS.Tables.Count > 0)
        {
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                int questCode = row["question_code"] != null ? int.Parse(row["question_code"].ToString()) : -1; 
                string quest = row["question"] != null ? row["question"].ToString() : "";
                string ans = row["answer"] != null ? row["answer"].ToString() : "";
                FAQ question = new FAQ(ItemId, questCode, quest, ans);
                Questions.Add(question);
            }
        }
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
           ,[product_Name]
           ,[price])
     VALUES
           (@ProductDesc, @ProductCatCode, @ProductCity, @ProductSeller, @ProductName,@Price)";

        DbService db = new DbService();
        SqlParameter parProdDesc = new SqlParameter("@ProductDesc", ItemDesc);
        SqlParameter parProdCatCode = new SqlParameter("@ProductCatCode", Item_Categories.Cat_id);
        SqlParameter parProdCity = new SqlParameter("@ProductCity", Location.CityCode);
        SqlParameter parProdSeller = new SqlParameter("@ProductSeller", seller);
        SqlParameter parProdName = new SqlParameter("@ProductName", ItemName);
        SqlParameter parPrice = new SqlParameter("@Price", int.Parse(Price) * 1.2);

        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parProdDesc, parProdCatCode, parProdCity, parProdSeller, parProdName, parPrice) == 0)
        {
            return false;
        }
        return true;
    }

    // פונקציה להבאת נתוני פריט.  לא נוסתה!!
    public Item GetItemDetails()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();

        string StrSql = "";
        StrSql = "select * from [product] where product_code ='" + ItemId + "' ";
        DS = db.GetDataSetByQuery(StrSql);
        if (DS.Tables[0].Rows.Count > 0)
        {
            ItemName = DS.Tables[0].Rows[0]["product_Name"].ToString();
            ItemDesc = DS.Tables[0].Rows[0]["product_Description"].ToString();      
        }
        return this;
    }

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

}

#endregion


