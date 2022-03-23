package edu.brown.cs.student.main;
import static org.junit.Assert.assertEquals;
import org.junit.Test;
import java.sql.SQLException;
import java.io.IOException;
import edu.brown.cs.student.main.table.Table;
import edu.brown.cs.student.main.table.Column;
import java.util.List;

public class ColumnDataTest {
  @Test
  public void findMovieData() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/movies.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("name_lookup");
    assertEquals("Iron Man", table.getColumns().get(1).getRows().get(3));
  }

  @Test
  public void findHoroscopeData() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/horoscopes.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("horoscopes");
    assertEquals("Aquarius", table.getColumns().get(1).getRows().get(10));
  }

  @Test
  public void findKanbanData() throws SQLException, ClassNotFoundException {
    REPL repl = new REPL();
    repl.parse("load data/kanban.sqlite3");
    DataStorage data = repl.getDataStorage();
    Table table = data.getTables().get("kanban");
    assertEquals("LASER TAGGGGGG!!!!!", table.getColumns().get(3).getRows().get(4));
  }
}