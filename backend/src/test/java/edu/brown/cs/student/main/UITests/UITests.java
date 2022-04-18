package edu.brown.cs.student.main.UITests;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.safari.SafariDriver;
import org.openqa.selenium.support.ui.Select;
import java.nio.file.FileSystems;
import java.util.List;

import static org.junit.Assert.assertEquals;

public class UITests {
    private WebDriver driver = null;
    private String indexPath = "";

    /**
     * Set up for a new test
     */
    @Before
    public void setup() {
        String absolutePath = FileSystems.getDefault().getPath("../frontend/table/table.html")
                .normalize()
                .toAbsolutePath()
                .toString();
        this.indexPath = "file://" + absolutePath;
        this.driver = new SafariDriver();
        driver.navigate().to(this.indexPath);
    }

    /**
     * Remove references created by a test, reset to old state, etc.
     */
    @After
    public void tearDown() {
        driver.quit();
    }

    /**
     * Checks if the page title and header are correct
     */
    @Test
    public void testCorrectTitle() {
        String title = driver.getTitle();
        assertEquals(title, "Table");
        WebElement H1 = driver.findElement(By.tagName("H1"));
        String header = H1.getText();
        assertEquals(header, "Sprint 3 Table Visualization");
    }

    /**
     * Checks that a load button exists
     * Checks that a dropdown exists
     */
    @Test
    public void testButtonsStruct() {
        WebElement loadButton = driver.findElement(By.id("loader"));
        String tagOne = loadButton.getTagName();
        assertEquals(tagOne, "BUTTON");
        WebElement dropdown = driver.findElement(By.id("dropdown"));
        String tagTwo = dropdown.getTagName();
        System.out.print(tagTwo);
        assertEquals(tagTwo, "DIV");
    }

    /**
     * checks for horoscopes table
     */
    @Test
    public void testHoroscopesTable() {
        WebElement loadButton = driver.findElement(By.id("loader"));
        loadButton.click();
        List<WebElement> table = driver.findElements(By.xpath("//*[@id=\"content\"]/table"));
        //WebElement table = driver.findElement(By.xpath("//table"));
        //Select dropdown = new Select(driver.findElement(By.id("content")));
        //System.out.println(tables.getSize());
    }

    /**
     * checks for movies table
     */
    @Test
    public void testMoviesTable() {
        WebElement loadButton = driver.findElement(By.id("loader"));
        loadButton.click();
        List<WebElement> table = driver.findElements(By.xpath("//*[@id=\"content\"]/table"));
        //WebElement subTable = table.findElement(By.id("film"));
        //List<WebElement> row = table.get(0).findElements(By.tagName("tr"));
        //assertEquals(151, row.size());
        //WebElement table = driver.findElement(By.xpath("//table"));
        //Select dropdown = new Select(driver.findElement(By.id("content")));
        //System.out.println(tables.getSize());
    }

    /**
     * checks for kanban table
     */
    @Test
    public void testKanbanTable() {
        WebElement loadButton = driver.findElement(By.id("loader"));
        loadButton.click();
        List<WebElement> table = driver.findElements(By.xpath("//*[@id=\"content\"]/table"));
        //List<WebElement> row = table.get(0).findElements(By.tagName("tr"));
        //WebElement subTable = table.findElement(By.id("kanban"));
        //assertEquals(9, row.size());
        //WebElement table = driver.findElement(By.xpath("//table"));
        //Select dropdown = new Select(driver.findElement(By.id("content")));
        //System.out.println(tables.getSize());
    }

   
    @Test
    public void testWrong() {
        //driver.get(indexPath);
        //assertEquals(driver.getTitle(), "React App");
    }





}
