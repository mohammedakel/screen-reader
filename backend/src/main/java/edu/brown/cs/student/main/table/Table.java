package edu.brown.cs.student.main.table;

import java.util.List;

/**
 * The overarching Table class which represents a single table from a database. Holds a variable
 * number of Columns, which in turn hold the actual data. Also has a name.
 */
public class Table {
  private final String name;
  private final List<Column> columns;
  public Table(String name, List<Column> columns) {
    this.name = name;
    this.columns = columns;
  }
  public List<Column> getColumns() {
    return columns;
  }
}
