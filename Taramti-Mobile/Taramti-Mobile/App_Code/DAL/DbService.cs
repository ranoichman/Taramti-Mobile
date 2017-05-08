using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

/// <summary>
/// Summary description for Dbs
/// </summary>
public class DbService
{
    SqlTransaction tran;
    SqlCommand cmd;
    SqlConnection con = new SqlConnection(ConfigurationManager.ConnectionStrings["ruppinConnectionString"].ConnectionString);
    
    SqlDataAdapter adp;
    public bool transactional = false;

    public DbService()
    {
        //
        // TODO: Add constructor logic here
        //
    }

    public DataSet GetDataSetByQuery(string sqlQuery, CommandType cmdType = CommandType.Text, params SqlParameter[] parametersArray)
    {
        cmd = new SqlCommand(sqlQuery, con);
        cmd.CommandType = cmdType;
        DataSet ds = new DataSet();
        adp = new SqlDataAdapter(cmd);

        foreach (SqlParameter s in parametersArray)
        {
            cmd.Parameters.AddWithValue(s.ParameterName, s.Value);
        }

        try
        {
            adp.Fill(ds);
        }
        catch (Exception e)
        {
            //do something with the error
            ds = null;
        }

        return ds;
    }

    public int GetScalarByQuery (string sqlQuery, CommandType cmdType = CommandType.Text, params SqlParameter[] parametersArray)
    {
        cmd = new SqlCommand(sqlQuery, con);
        cmd.CommandType = cmdType;
        int res = 0;

        string id = "0";
        foreach (SqlParameter s in parametersArray)
        {
            cmd.Parameters.AddWithValue(s.ParameterName, s.Value);
        }

        try
        {
            con.Open();
            id = cmd.ExecuteScalar().ToString();
            res = Convert.ToInt32(id);
        }
        catch (Exception e)
        {
            //do something with the error
        }
        finally
        {
            con.Close();
        }



        return res;
    }

    public int ExecuteQuery(string sqlQuery, CommandType cmdType = CommandType.Text, params SqlParameter[] parametersArray)
    {
        int row_affected = 0;
        using (con)
        {

            con.Open();
            tran = con.BeginTransaction();

            cmd = new SqlCommand(sqlQuery, con, tran);
            cmd.CommandType = cmdType;

            foreach (SqlParameter s in parametersArray)
            {
                cmd.Parameters.AddWithValue(s.ParameterName, s.Value);
            }

            try
            {
                row_affected = cmd.ExecuteNonQuery();
                tran.Commit();
            }
            catch (Exception e)
            {
                tran.Rollback();
            }
            //finally
            //{
            //    con.Close();
            //}

        }

        return row_affected;
    }

    public object GetObjectScalarByQuery(string sqlQuery, CommandType cmdType = CommandType.Text, params SqlParameter[] parametersArray)
    {
        cmd = new SqlCommand(sqlQuery, con);
        cmd.CommandType = cmdType;
        object res = "0";

        foreach (SqlParameter s in parametersArray)
        {
            cmd.Parameters.AddWithValue(s.ParameterName, s.Value);
        }

        try
        {
            con.Open();
            res = cmd.ExecuteScalar();
        }
        catch (Exception e)
        {
            //do something with the error
        }
        finally
        {
            con.Close();
        }

        return res;
    }

}