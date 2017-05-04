using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
/// 
public class Voluntary_association
{
    string association_Code;
    string association_Name;
    string association_Desc;
    string association_Account;
    string association_WebSite;
    string association_Year;
    string association_Image;
    List<Association_Tag> association_Tags;
    List<UserT> permittedUsers;
    List<Auction> auctions;


    //props
    #region
    public string Association_Name
    {
        get
        {
            return association_Name;
        }

        set
        {
            association_Name = value;
        }
    }

    public string Association_Desc
    {
        get
        {
            return association_Desc;
        }

        set
        {
            association_Desc = value;
        }
    }

    public List<Association_Tag> Association_Tags
    {
        get
        {
            return association_Tags;
        }

        set
        {
            association_Tags = value;
        }
    }

    public List<Auction> Auctions
    {
        get
        {
            return auctions;
        }

        set
        {
            auctions = value;
        }
    }

    public string Association_Code
    {
        get
        {
            return association_Code;
        }

        set
        {
            association_Code = value;
        }
    }

    public string Association_Account
    {
        get
        {
            return association_Account;
        }

        set
        {
            association_Account = value;
        }
    }

    public string Association_WebSite
    {
        get
        {
            return association_WebSite;
        }

        set
        {
            association_WebSite = value;
        }
    }

    public string Association_Year
    {
        get
        {
            return association_Year;
        }

        set
        {
            association_Year = value;
        }
    }

    public List<UserT> PermittedUsers
    {
        get
        {
            return permittedUsers;
        }

        set
        {
            permittedUsers = value;
        }
    }

    public string Association_Image
    {
        get
        {
            return association_Image;
        }

        set
        {
            association_Image = value;
        }
    }
    #endregion

    //Ctor
    public Voluntary_association(string association_Code, string association_Name, string association_Desc)
    {
        Association_Code = association_Code;
        Association_Name = association_Name;
        Association_Desc = association_Desc;
        //this.Association_Tags = association_Tags;
    }

    public Voluntary_association(string association_Code, string association_Name, string association_Desc, string account, string website, string year, List<UserT> permitted)
    {
        Association_Code = association_Code;
        Association_Name = association_Name;
        Association_Desc = association_Desc;
        association_Account = account;
        Association_WebSite = website;
        Association_Year = year;
        PermittedUsers = permitted;
    }

    public Voluntary_association(string association_Code, string association_Name, string association_Desc, string account, string website, string year)
    {
        Association_Code = association_Code;
        Association_Name = association_Name;
        Association_Desc = association_Desc;
        Association_WebSite = website;
        Association_Year = year;
        Association_Account = account;
    }

    public Voluntary_association(string association_Code, string association_Name, string association_Desc, string account, string website, string year, string image)
    {
        Association_Code = association_Code;
        Association_Name = association_Name;
        Association_Desc = association_Desc;
        Association_Account = account;
        Association_WebSite = website;
        Association_Year = year;
        Association_Image = image;
    }

    public Voluntary_association()
    {
        PermittedUsers = new List<UserT>();
        Association_Tags = new List<Association_Tag>();
        Auctions = new List<Auction>();
    }

    public Voluntary_association(string code) : this()
    {
        Association_Code = code;
    }


    /*
     ////////////////////////////
     ////////////////////////////
     מתודות
     ////////////////////////////
     ////////////////////////////
    */


    //methods
    #region
    public void ShowAssocDetails()
    {

    }


    //public static List<string> GetAssociationByCode(string code)
    //{
    //    DbService db = new DbService();
    //    DataSet DS = new DataSet();
    //    List<string> Lists = new List<string>();
    //    string sql = "select * from association  " +
    //                 "where association_code='" + code + "' ";
    //    DS = db.GetDataSetByQuery(sql);
    //    foreach (DataRow row in DS.Tables[0].Rows)
    //    {
    //        Lists.Add(row[0].ToString());
    //    }

    //    return Lists;
    //}

    // הפיכה לסטטי כדי להיקרא מאג'קס

    /// <summary>
    /// הבאת כל פרטי העמותות
    /// </summary>
    /// <returns>מחזירה רשימה עם פרטי כל העמותות</returns>
    public static List<Voluntary_association> GetAllAssociations()
    {
        DataSet DS = new DataSet();
        DbService db = new DbService();
        List<Voluntary_association> Lists = new List<Voluntary_association>();

        DS = db.GetDataSetByQuery(@"select association_code from dbo.association ");

        foreach (DataRow row in DS.Tables[0].Rows)
        {
            Voluntary_association a = new Voluntary_association(row[0].ToString());
            a.GetAssociationByCodeAmuta();
            Lists.Add(a);
        }

        return Lists;
    }

    /// <summary>
    /// הבאת פרטי העמותה על פי קוד
    /// </summary>
    public void GetAssociationByCodeAmuta()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        //Voluntary_association A = new Voluntary_association();
        string sql1 = "select * from association  " +
                     "where association_code= @code";
        string sql2 = @" SELECT dbo.users.user_id,dbo.users.first_name, dbo.users.last_name,dbo.users.active 
                        FROM dbo.association_access LEFT JOIN 
                        dbo.users ON dbo.association_access.user_id = dbo.users.user_id 
                        WHERE(dbo.association_access.association_code = @code )";
        string sql3 = @" SELECT dbo.tags.tag_code, dbo.tags.tag_desc
                        FROM  dbo.tag_of_association INNER JOIN
                        dbo.tags ON dbo.tag_of_association.tag_code = dbo.tags.tag_code
                        WHERE        (dbo.tag_of_association.association_code = @code)";


        SqlParameter parCode = new SqlParameter("@code", Association_Code);
        DS = db.GetDataSetByQuery(sql1 + sql2 + sql3, CommandType.Text, parCode);

        //מילוי פרטים
        foreach (DataRow row in DS.Tables[0].Rows)
        {

            Association_Code = row[0].ToString();
            Association_Name = row[1].ToString();
            Association_Desc = row[2].ToString();
            Association_Account = row[3].ToString();
            Association_WebSite = row[4].ToString();
            Association_Image = row[5].ToString();
            Association_Year = row[6].ToString();
        }

        //מילוי רשימת מורשי גישה
        foreach (DataRow row in DS.Tables[1].Rows)
        {
            UserT permitted = new UserT(row[0].ToString(), row[1].ToString(), row[2].ToString(), bool.Parse(row[3].ToString()));
            List<Voluntary_association> temp_li = permitted.GetUserAssociations();
            permitted.Address = temp_li.Count.ToString(); //שימוש חד פעמי בשדה כתובת להעברת מס' לדף הטמל
            PermittedUsers.Add(permitted);
        }

        //מילוי רשימת תגיות
        foreach (DataRow row in DS.Tables[2].Rows)
        {
            Association_Tag tag = new Association_Tag(int.Parse(row[0].ToString()), row[1].ToString());
            Association_Tags.Add(tag);
        }
    }

    /// <summary>
    /// מתודה שמרכזת תעודות זהות של משתמשים מורשים לפי קוד עמותה
    /// </summary>
    /// <returns>מחזירה ליסט של סטרינגים(ת.זים)</returns>
    public static List<string> GetAssociationMurshimByCodeAmuta(int assocCode)
    {

        string sqlSelect = @"Select [user_id]
                            from [dbo].[association_access]
                            Where [association_code] = @assocCode";

        DbService db = new DbService();

        SqlParameter parAssocCode = new SqlParameter("@assocCode", assocCode);
        DataTable dtMurshim = new DataTable();
        try
        {
            dtMurshim = db.GetDataSetByQuery(sqlSelect, CommandType.Text, parAssocCode).Tables[0];
            List<string> Murshim = new List<string>();

            foreach (DataRow row in dtMurshim.Rows)
            {
                string id = row[0].ToString();
                Murshim.Add(id);
            }

            return Murshim;
        }

        catch (Exception ex)
        {
            throw ex;
        }

    }

    /// <summary>
    /// מתודה להוספת משתמש כמורשה גישה לעמותה   
    /// </summary>
    /// <param name="id"></param>
    /// <param name="assocCode"></param>
    /// <returns>מחזירה אמת אם המשתמש נוסף, שקר אחרת</returns>
    public static bool AddMursheAssoc(string id, int assocCode)
    {
        string sqlInsert = @"insert into [dbo].[association_access]
                           ([user_id]
                           ,[association_code])
                            VALUES 
                            (@id, @assocCode)";

        DbService db = new DbService();
        SqlParameter parId = new SqlParameter("@id", id);
        SqlParameter parAssocCode = new SqlParameter("@assocCode", assocCode);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parId, parAssocCode) == 0)
        {
            return false;
        }

        return true;
    }



    /// <summary>
    /// הבאת סך התרומות לעמותה
    /// </summary>
    /// <returns>מחזירה את סכום התרומות לפי קוד</returns>
    public int GetDonationSum()
    {
        string sql = @"SELECT sum(final_price * donation_percentage / 100) AS donation_amount
                        FROM dbo.auction
                        WHERE (association_code = @code)";
        SqlParameter parCode = new SqlParameter("@code", Association_Code);
        DbService db = new DbService();
        return db.GetScalarByQuery(sql, CommandType.Text, parCode);
    }
    /// <summary>
    /// מתודה לעדכון נתוני העמותה בשרת
    /// </summary>
    public void UpdateTbl()
    {
        DbService db = new DbService();
        string StrSql = "update dbo.association set " +
                        "association_name = @name, " +
                        "association_desc = @desc, " +
                        "account = @acc, " +
                        "website = @web, " +
                        //"image = @image, " +
                        "year = @year " +
                        "where association_code ='" + Association_Code + "' ";

        SqlParameter parname = new SqlParameter("@name", Association_Name);
        SqlParameter pardesc = new SqlParameter("@desc", Association_Desc);
        SqlParameter paraccount = new SqlParameter("@acc", Association_Account);
        SqlParameter parweb = new SqlParameter("@web", Association_WebSite);
        //SqlParameter parimg = new SqlParameter("@image", "");
        SqlParameter paryear = new SqlParameter("@year", Association_Year);

        db.ExecuteQuery(StrSql, CommandType.Text, parname, pardesc, paraccount, parweb, paryear);

    }

    // הוספת עמותה
    public void AddAssoc()
    {
        DbService db = new DbService();
       string  StrSql = "INSERT INTO [dbo].[association] " +
                 "([association_code] " +
                 ",[association_name] " +
                 ",[association_desc] " +
                 ",[account] " +
                 ",[website] " +
                 ",[image] " +
                 ",[year]) " +
       "VALUES " +
                  "(@code, @name, @desc, @acc, @web, @img, @year) ";
        SqlParameter parcode = new SqlParameter("@code", Association_Code);
        SqlParameter parname = new SqlParameter("@name", Association_Name);
        SqlParameter pardesc = new SqlParameter("@desc", Association_Desc);
        SqlParameter paraccount = new SqlParameter("@acc", Association_Account);
        SqlParameter parweb = new SqlParameter("@web", Association_WebSite);
        //SqlParameter parimg = new SqlParameter("@img", "");
        SqlParameter paryear = new SqlParameter("@year", Association_Year);

        db.ExecuteQuery(StrSql, CommandType.Text,parcode, parname, pardesc, paraccount, parweb, paryear);

    }
    // הוספת עמותה זמנית
    public void AddTempAssoc()
    {
        DbService db = new DbService();
        string StrSql = "INSERT INTO [dbo].[temp_association] " +
                  "([association_code] " +
                  ",[association_name] " +
                  ",[association_desc] " +
                  ",[account] " +
                  ",[website] " +
                  ",[image] " +
                  ",[year]) " +
        "VALUES " +
                   "(@code, @name, @desc, @acc, @web, @img, @year) ";
        SqlParameter parcode = new SqlParameter("@code", Association_Code);
        SqlParameter parname = new SqlParameter("@name", Association_Name);
        SqlParameter pardesc = new SqlParameter("@desc", Association_Desc);
        SqlParameter paraccount = new SqlParameter("@acc", Association_Account);
        SqlParameter parweb = new SqlParameter("@web", Association_WebSite);
        //SqlParameter parimg = new SqlParameter("@img", "");
        SqlParameter paryear = new SqlParameter("@year", Association_Year);

        db.ExecuteQuery(StrSql, CommandType.Text, parcode, parname, pardesc, paraccount, parweb, paryear);

    }

    #endregion



}
