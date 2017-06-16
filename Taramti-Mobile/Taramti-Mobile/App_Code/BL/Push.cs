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

    public Push(string userId, string platform, string deviceString)
    {
        this.UserId = userId;
        this.Platform = platform;
        this.DeviceString = deviceString;
    }

    //methods
    public bool AddPushDetails()
    {
        string sqlInsert = @"insert into [dbo].[push]
                           ([user_id],[device_string],[platform])
                            VALUES 
                            (@id, @device, @platform)";
        DbService db = new DbService();
        SqlParameter parId = new SqlParameter("@id", UserId);
        SqlParameter parDevice = new SqlParameter("@device", DeviceString);
        SqlParameter parPlatform = new SqlParameter("@platform", Platform);
        if (db.ExecuteQuery(sqlInsert, CommandType.Text, parId, parDevice, parPlatform) == 0)
        {
            return false;
        }
        return true;
    }
}