using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class Association_Tag
{
    //fields
    int code;
    string tag_Name;
    Voluntary_association[] vol_asc;

    //props
    #region
    public string Tag_Name
    {
        get
        {
            return tag_Name;
        }

        set
        {
            tag_Name = value;
        }
    }

    public Voluntary_association[] Vol_asc
    {
        get
        {
            return vol_asc;
        }

        set
        {
            vol_asc = value;
        }
    }

    public int Code
    {
        get
        {
            return code;
        }

        set
        {
            code = value;
        }
    }
    #endregion

    //ctor
    public Association_Tag()
    {

    }

    public Association_Tag(int code, string name)
    {
        Code = code;
        Tag_Name = name;
    }

    //methods
    #region
    /// <summary>
    /// הפונקציה מחזירה רשימה של קטגוריות העמותות השונות
    /// </summary>
    /// <returns> List<Association_Tag> </returns>
    public List<Association_Tag> GetAllAuctionsCategories()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        List<Association_Tag> allCat = new List<Association_Tag>();
        string StrSql = "SELECT * FROM tags order by tag_desc ";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables.Count > 0)
        {
            foreach (DataRow row in DS.Tables[0].Rows)
            {
                Association_Tag Item = new Association_Tag();
                Item.Code = int.Parse(row["tag_code"].ToString());
                Item.Tag_Name = row["tag_desc"].ToString();
                allCat.Add(Item);
            }
        }
        return allCat;
    }
    #endregion


}
