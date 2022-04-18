package edu.brown.cs.student.main;

import edu.brown.cs.student.main.table.Column;
import edu.brown.cs.student.main.table.Table;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import spark.Spark;
import com.google.gson.Gson;

import java.util.List;


/**
 * The Main class of our project. This is where execution begins.
 *
 */

public final class Main {

  private static final int DEFAULT_PORT = 4567;

  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   */
  public static void main(String[] args) {
    new Main(args).run();
  }

  private String[] args;
  private static REPL repl;

  public Main(String[] args) {
    this.args = args;
  }

  private void run() {
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    parser.accepts("port").withRequiredArg().ofType(Integer.class).defaultsTo(DEFAULT_PORT);

    OptionSet options = parser.parse(args);
    if (options.has("gui")) {
      runSparkServer((int) options.valueOf("port"));
    }
    //create and run the REPL
    repl = new REPL();
    repl.doREPL();
  }
  public static void runSparkServer(int port) {
    Spark.port(port);
    Spark.externalStaticFileLocation("src/main/resources/static");
    Spark.options("/*", (request, response) -> {
      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");

      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });
    Spark.before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));
    // Put Routes Here
    Spark.get("/table", new TableHandler());
    Spark.post("/delete-row", new DeleteRow());
    Spark.post("/delete-column", new DeleteColumn());
    Spark.post("/add-row", new AddRow());
    Spark.init();
  }
  /**
   * Handles GET requests called from the frontend. Will return a JSON-formatted String of all the
   * Table data. As such, the GET request only needs to be called once.
   */
  private static class TableHandler implements Route {
    @Override
    public String handle(Request req, Response res) {
      DataStorage data = repl.getDataStorage();
      Gson gson = new Gson();
      return gson.toJson(data.getTables().values());
    }
  }

  private class DeleteRow implements Route {
    @Override
    public String handle(Request req, Response res) throws JSONException {
      JSONObject reqJson = null;
      try {
        // Put the request's body in JSON format
        reqJson = new JSONObject(req.body());
      } catch (JSONException e) {
        e.printStackTrace();
      }

      String tableName = reqJson.getString("table");
      DataStorage data = repl.getDataStorage();
      Table table = data.getTables().get(tableName);
      List<Column> columns = table.getColumns();
      for (Column col : columns) {
        col.deleteRow(reqJson.getInt("row"));
      }
      return "";
    }
  }

  private class DeleteColumn implements Route {
    @Override
    public String handle(Request req, Response res) throws JSONException {
      JSONObject reqJson = null;
      try {
        // Put the request's body in JSON format
        reqJson = new JSONObject(req.body());
      } catch (JSONException e) {
        e.printStackTrace();
      }

      String tableName = reqJson.getString("table");
      DataStorage data = repl.getDataStorage();
      Table table = data.getTables().get(tableName);
      List<Column> columns = table.getColumns();
      Column deleteThisOne = null;
      for (Column col : columns) {
        if (col.getName().equals(reqJson.getString("column"))) {
          deleteThisOne = col;
          break;
        }
      }
      table.getColumns().remove(deleteThisOne);
      return "";
    }
  }

  private class AddRow implements Route {
    @Override
    public String handle(Request req, Response res) throws JSONException {
      JSONObject reqJson = null;
      try {
        // Put the request's body in JSON format
        reqJson = new JSONObject(req.body());
      } catch (JSONException e) {
        e.printStackTrace();
      }

      String tableName = reqJson.getString("table");
      DataStorage data = repl.getDataStorage();
      Table table = data.getTables().get(tableName);
      List<Column> columns = table.getColumns();
      JSONArray content = reqJson.getJSONArray("content");
      //content should have the same number of columns as the Table
      for (int i = 0; i < content.length(); i++) {
        columns.get(i).getRows().add(0, content.getString(i));
      }
      return "";
    }
  }
}
