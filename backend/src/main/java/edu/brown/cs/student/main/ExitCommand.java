package edu.brown.cs.student.main;

import java.util.ArrayList;

/**
 * ExitCommand simply exits the REPL/program by calling System.exit().
 */
public class ExitCommand implements Command {

  public void doCommand(DataStorage data, ArrayList<String> arguments) {
    System.exit(0);
  }
}
