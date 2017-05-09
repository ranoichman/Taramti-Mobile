using System;
using System.Collections.Generic;
using System.Data;
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
    }

    //methods
    #region
    public void ShowAuctionByCity() { }

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
