package edu.brown.cs.student.main.table;

import java.util.ArrayList;
import java.util.List;

/**
 * Column class represents a single column of a single Table. If, in the future, columns need to be
 * edited (e.g., add more rows), that should be fairly simple. The "final" keyword might have to be
 * removed from the name and/or type if the change is more intrusive.
 */
public class Column {
  private final String name;
  private final String type;
  //the String type here might need to be modified (or at least parsed) if sorting matters
  private final List<String> rows;

  /**
   * Constructor sets up the instance variables.
   * @param name  The name of the column (what is displayed at the header)
   * @param type  The type of the data within this column (for use in parsing integers, etc.)
   *              This will likely not be sent (?) to the frontend at first, but adding it would be
   *              simple.
   */
  public Column(String name, String type) {
    this.name = name;
    this.type = type;
    rows = new ArrayList<>();
  }
  public String getName() {
    return name;
  }

  /**
   * Add a row to the column. Called inside Database.java when the columns are being created.
   * Theoretically, could be called when the frontend wants to add data points.
   */
  public void addRow(String row) {
    rows.add(row);
  }
  public List<String> getRows() {
    return rows;
  }
}
