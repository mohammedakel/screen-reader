package edu.brown.cs.student.main;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import java.sql.SQLException;
import java.io.IOException;

public class SimpleLoadingTest {
  @Test
  public void countMovieTables() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/movies.sqlite3");
    DataStorage data = repl.getDataStorage();
    assertEquals(4, data.getTables().values().size());
  }
  @Test
  public void countHoroscopeTables() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/horoscopes.sqlite3");
    DataStorage data = repl.getDataStorage();
    assertEquals(4, data.getTables().values().size());
  }
  @Test
  public void countKanbanTables() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/kanban.sqlite3");
    DataStorage data = repl.getDataStorage();
    assertEquals(2, data.getTables().values().size());
  }
}