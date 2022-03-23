package edu.brown.cs.student.main;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import java.sql.SQLException;
import java.io.IOException;
import edu.brown.cs.student.main.table.Table;
import edu.brown.cs.student.main.table.Column;
import java.util.List;

public class ConfirmColumnNameTest {
  @Test
  public void readMovieColumns() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/movies.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("name_lookup");
    assertEquals("actor", table.getColumns().get(0).getName());
  }

  @Test
  public void readKanbanColumns() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/kanban.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("kanban");
    assertEquals("content", table.getColumns().get(3).getName());
  }

  @Test
  public void readHoroscopeColumns() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/horoscopes.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("tas");
    assertEquals("role", table.getColumns().get(2).getName());
  }
}