using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Settings
/// </summary>
public class Settings
{
    string userId;
    bool push, vibe, sound;

    // Props
    #region
    public string UserId
    {
        get
        {
            return userId;
        }

        set
        {
            userId = value;
        }
    }

    public bool Push
    {
        get
        {
            return push;
        }

        set
        {
            push = value;
        }
    }

    public bool Vibe
    {
        get
        {
            return vibe;
        }

        set
        {
            vibe = value;
        }
    }

    public bool Sound
    {
        get
        {
            return sound;
        }

        set
        {
            sound = value;
        }
    }
    #endregion

    //Ctors
    #region
    public Settings()
    {
        //
        // TODO: Add constructor logic here
        //
    }
  
    public Settings(string userId, bool push, bool vibe, bool sound)
    {
        this.UserId = userId;
        this.Push = push;
        this.Vibe = vibe;
        this.Sound = sound;
    }
    #endregion

    //Methods
    #region

        // הכנסת העדפות למשתמש
    public void Insert()
    {
        DbService db = new DbService();
        string StrSql = "";
        bool exists = CheckIfSettingsExists();
        if (exists)
        {
            StrSql = "Update user_settings set [push] = @push, [vibe] = @vibe, [sound] = @sound where user_id ='" + UserId + "' ";
            SqlParameter parPush = new SqlParameter("@push", UserId);
            SqlParameter parSound = new SqlParameter("@sound", Sound);
            SqlParameter parVibe = new SqlParameter("@vibe", Vibe);
            db.ExecuteQuery(StrSql, CommandType.Text, parPush, parSound, parVibe);
        }
        else
        {
            StrSql = "insert into user_settings ([user_id],[push],[vibe],[sound]) " +
                     "values (@user,@push,@vibe,@sound)";
            SqlParameter parUser = new SqlParameter("@user", UserId);
            SqlParameter parPush = new SqlParameter("@push", Push);
            SqlParameter parSound = new SqlParameter("@sound", Sound);
            SqlParameter parVibe = new SqlParameter("@vibe", Vibe);
            db.ExecuteQuery(StrSql, CommandType.Text, parUser, parPush, parSound, parVibe);
        }

    }

    // בדיקה האם כבר קיימת שורה בטבלת הסקל לאותו יוזר, אם כן נבצע עדכון ולא הכנסה
    public bool CheckIfSettingsExists()
    {
        DbService db = new DbService();
        DataSet DS = new DataSet();
        string StrSql = "select user_id from user_settings where user_id ='" + UserId + "' ";
        DS = db.GetDataSetByQuery(StrSql);

        if (DS.Tables[0].Rows.Count > 0)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    #endregion
}