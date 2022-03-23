package edu.brown.cs.student.main;

import java.util.ArrayList;

/**
 * Command interface is implemented by a new Command class for everything the user could want to do.
 * Each Command is stored in a HashMap within REPL.java, and should handle its own error checking.
 */
public interface Command {
  /**
   * doCommand method actually executes whatever the implementing Command class does.
   * @param data DataStorage class with Tables; it doesn't need to be used.
   * @param arguments Additional arguments the Command may take; this can be empty.
   */
  void doCommand(DataStorage data, ArrayList<String> arguments);
}
