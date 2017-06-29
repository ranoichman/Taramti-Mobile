using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Push
/// </summary>
public class Push
{
    string userId;
    string platform;
    string deviceString;

    //Props
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

    public string Platform
    {
        get
        {
            return platform;
        }

        set
        {
            platform = value;
        }
    }

    public string DeviceString
    {
        get
        {
            return deviceString;
        }

        set
        {
            deviceString = value;
        }
    }
    #endregion

    public Push()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public Push(string userId)
    {
        this.UserId = userId;
    }

    public Push(string userId, string deviceString, string platform)
    {
        this.UserId = userId;
        this.Platform = platform;
        this.DeviceString = deviceString;
    }

    //methods
    // הפונקציה תעדכן או תוסיף נתונים לבסיס הנתונים אודות המכשיר המתאים לשלוח אליו התראות
    public bool AddPushDetails()
    {
        DbService db = new DbService();
        string sqlInsert = "select [user_id] from [dbo].[push] where [user_id] = @id ";
        SqlParameter parId = new SqlParameter("@id", UserId);
        SqlParameter parDevice = new SqlParameter("@device", DeviceString);
        SqlParameter parPlatform = new SqlParameter("@platform", Platform);

        if (db.GetDataSetByQuery(sqlInsert, CommandType.Text, parId).Tables[0].Rows.Count > 0)
        {
            sqlInsert = @"update [dbo].[push]
                             set [device_string] = @device, [platform] = @platform
                             where [user_id] = @id ";
        }
        else
        {
            sqlInsert = @"insert into [dbo].[push]
                           ([user_id],[device_string],[platform])
                            VALUES 
                            (@id, @device, @platform)";
        }
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parId, parDevice, parPlatform) == 0)
        {
            return false;
        }
        return true;
    }

    public void GetPushInfo()
    {
        string sqlSelect = @"SELECT [device_string],[platform]
                            FROM [dbo].[push]
                            where (user_id =" + UserId + ") ";
        DbService db = new DbService();
        //SqlParameter parUser = new SqlParameter("@user", UserId);

        DataTable DT = new DataTable();
        DT = db.GetDataSetByQuery(sqlSelect).Tables[0];

        if (DT.Rows.Count > 0)
        {
            Platform = DT.Rows[0]["platform"].ToString();
            DeviceString = DT.Rows[0]["device_string"].ToString();
        }
    }
}