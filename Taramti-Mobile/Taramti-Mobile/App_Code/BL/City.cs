using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Class1
/// </summary>
public class City
{
    //fields
    int cityCode;
    string cityName;
    UserT[] users;

    //props
    #region
    public string CityName
    {
        get { return cityName; }
        set { cityName = value; }
    }

    public int CityCode
    {
        get { return cityCode; }
        set { cityCode = value; }
    }

    public UserT[] Users
    {
        get
        {
            return users;
        }

        set
        {
            users = value;
        }
    }
    #endregion

    //ctor
    public City()
    {

    }

    public City(int code)
    {
        CityCode = code;
        getCityName();
    }

    //methods
    #region
    public void ShowAuctionByCity() { }

    private void getCityName()
    {
        if (CityCode == -1)
        {
            CityName = "";
        }
        else
        {
            string strSql = @"SELECT city_name
                            FROM dbo.city
                            WHERE (city_code = @city)";
            SqlParameter parCity = new SqlParameter("@city", CityCode);
            DbService dbs = new DbService();
            DataTable dt = new DataTable();

            dt = dbs.GetDataSetByQuery(strSql, CommandType.Text, parCity).Tables[0];

            CityName = dt.Rows[0]["city_name"].ToString();
        }
    }

    public List<City> GetAllCities()
    {
        DbService dbs = new DbService();
        DataSet DS = new DataSet();
        List<City> Cities = new List<City>();

        string StrSql = "select * from City ";
        DS = dbs.GetDataSetByQuery(StrSql);

        foreach (DataRow row in DS.Tables[0].Rows)
        {
            City C = new City();
            C.CityCode = int.Parse(row[0].ToString());
            C.CityName = row[1].ToString();
            Cities.Add(C);
        }

        return Cities;

    }
    #endregion

}
