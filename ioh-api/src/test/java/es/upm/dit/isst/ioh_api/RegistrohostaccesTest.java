package es.upm.dit.isst.ioh_api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import static org.junit.jupiter.api.Assertions.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.interactions.Actions;

import java.time.Duration;
import java.util.*;

public class RegistrohostaccesTest {
  private WebDriver driver;
  private Map<String, Object> vars;
  JavascriptExecutor js;

  @BeforeEach
  public void setUp() {
    driver = new FirefoxDriver();
    js = (JavascriptExecutor) driver;
    vars = new HashMap<String, Object>();
  }

  @AfterEach
  public void tearDown() {
    driver.quit();
  }

  @Test
  public void registrohostacces() {
    driver.get("http://localhost:5173/register");
    driver.manage().window().setSize(new Dimension(1086, 691));
    driver.findElement(By.id("register-button")).click();
    driver.findElement(By.id("host-register-button")).click();
    driver.findElement(By.name("email")).sendKeys("host@host.com");
    driver.findElement(By.name("password")).sendKeys("1234");
    driver.findElement(By.name("seamApiKey")).sendKeys("seam_test2L3y_93S42w47iUvh5D9YU8USEdtR");
    driver.findElement(By.id("host-register-button-confirm")).click();

    // Esperar a que la URL contenga /admin/home y luego que el botón esté visible
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.urlContains("/admin/home"));
    WebElement addAccessCard = wait.until(ExpectedConditions.elementToBeClickable(By.id("add-access-card")));
    addAccessCard.click();

    WebElement dropdown = driver.findElement(By.id("select-lock"));
    dropdown.findElement(By.xpath("//option[. = 'BACK DOOR (ID: 0c812b33-db9b-4dbd-a890-920a60b95811)']")).click();
    driver.findElement(By.id("input-token")).click();
    driver.findElement(By.id("input-usuario")).sendKeys("cliente@gmail.com");
    driver.findElement(By.id("input-fecha-entrada")).sendKeys("2025-05-06T12:00");
    driver.findElement(By.id("input-fecha-salida")).sendKeys("2025-05-08T21:00");
    driver.findElement(By.id("submit-new-access")).click();

    wait.until(ExpectedConditions.elementToBeClickable(By.id("configure-button-1"))).click();
    driver.findElement(By.id("edit-generate-token-button")).click();
    driver.findElement(By.id("submit-edit-access")).click();

    // Scroll or hover to confirm visual confirmation (opcional)
    WebElement element = driver.findElement(By.id("submit-edit-access"));
    Actions builder = new Actions(driver);
    builder.moveToElement(element).perform();
  }
}