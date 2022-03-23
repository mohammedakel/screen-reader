package edu.brown.cs.student.main;
import edu.brown.cs.student.main.table.Column;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

/**
 * Database class has its main code taken from the database-lab. Loads an SQL database into the
 * DataStorage class.
 */
public class Database {
  private static Connection conn = null;

  /**
   * Database constructor takes in a filename (usually given from the REPL via LoadDatabase.java).
   * @param filename  The String representing the path to the database file.
   * @throws SQLException if an error occurs in any SQL query.
   */
  public Database(String filename) throws SQLException, ClassNotFoundException {
    Class.forName("org.sqlite.JDBC");
    String urlToDB = "jdbc:sqlite:" + filename;
    conn = DriverManager.getConnection(urlToDB);
    // these two lines tell the database to enforce foreign keys during operations,
    // and should be present
    Statement stat = conn.createStatement();
    stat.executeUpdate("PRAGMA foreign_keys=ON;");
  }

  /**
   * getTableNames is called from LoadDatabase to gather the names of all the tables in the
   * Database. These will be further used to generate Table objects for each corresponding table.
   * @return List of table names
   * @throws SQLException if an error occurs in any SQL query.
   */
  public List<String> getTableNames() throws SQLException {
    String sql = "SELECT name FROM sqlite_master WHERE type='table'";
    PreparedStatement tableFinder = conn.prepareStatement(sql);
    ResultSet rs = tableFinder.executeQuery();
    List<String> tables = new ArrayList<>();
    while (rs.next()) {
      tables.add(rs.getString(1));
    }
    return tables;
  }

  /**
   * Method called by LoadDatabase to create and load data into the Columns. This function sets up
   * the Column headers, and subsequently calls loadColumnData() to add each row of data to the
   * Column.
   * @param tableName     The name of the table for which we want to load the columns.
   * @throws SQLException if an error occurs in any SQL query.
   * @return  Each column of the table, fully loaded with data
   */
  public List<Column> createColumns(String tableName) throws SQLException {
    String sql = "SELECT * FROM PRAGMA_TABLE_INFO(?)";
    PreparedStatement tableFinder = conn.prepareStatement(sql);
    tableFinder.setString(1, tableName);
    ResultSet rs = tableFinder.executeQuery();
    /*
      After looking at the ResultSetMetaData, only the 2nd and 3rd indices contain information I
      care about: the column name and the type of data within the column. Every column in the given
      data sets has the same ResultSetMetaData, so I'm tentatively assuming it will scale.
     */
    List<Column> columns = new ArrayList<>();
    //for every column in the table:
    while (rs.next()) {
      ArrayList<String> columnDetails = new ArrayList<>();
      for (int i = 2; i < 4; i++) {
        columnDetails.add(rs.getString(i));
      }
      //make a new Column(name, type)
      columns.add(new Column(columnDetails.get(0), columnDetails.get(1).toLowerCase()));
    }
    //load each Column's rows
    for (Column col : columns) {
      loadColumnData(tableName, col);
    }
    //finally, return the Columns to LoadDatabase
    return columns;
  }

  /**
   * Method to fill each Column with its respective data.
   * @param tableName     Name of the Column's table
   * @param column        The Column, used for its name and its addRow() method.
   * @throws SQLException if an error occurs in any SQL query.
   */
  private void loadColumnData(String tableName, Column column) throws SQLException {
    /*
      Apparently this statement is vulnerable to SQL injection (bad!) but I really couldn't find
      a different way to dynamically select from variable columns and tables. Maybe it's okay
      in this specific use case?
     */
    String sql = "SELECT " + column.getName() + " FROM " + tableName;
    PreparedStatement columnFinder = conn.prepareStatement(sql);
    ResultSet rs = columnFinder.executeQuery();
    //for each row in the column:
    while (rs.next()) {
      column.addRow(rs.getString(1));
    }
  }
}
