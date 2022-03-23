package edu.brown.cs.student.main.commands;

import edu.brown.cs.student.main.DataStorage;

import java.util.ArrayList;

/**
 * ExitCommand simply exits the REPL/program by calling System.exit().
 */
public class ExitCommand implements Command {
  @Override
  public void doCommand(DataStorage data, ArrayList<String> arguments) {
    System.exit(0);
  }
}
