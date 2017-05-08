using System;
using System.Collections.Generic;
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
    public void GetAssociationTags()
    {

    }
    #endregion


}
