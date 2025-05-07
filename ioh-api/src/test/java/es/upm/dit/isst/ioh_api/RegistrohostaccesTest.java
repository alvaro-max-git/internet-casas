package es.upm.dit.isst.ioh_api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

import java.time.Duration;

public class RegistrohostaccesTest {
  private WebDriver driver;
  JavascriptExecutor js;

  @BeforeEach
  public void setUp() {
    driver = new FirefoxDriver();
    js = (JavascriptExecutor) driver;
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

// --- Interacción con el <select> de cerraduras ---
    // 1. Esperar a que el <select> esté presente y sea clickeable
    WebElement selectLockElement = wait.until(ExpectedConditions.elementToBeClickable(By.id("select-lock")));
    // 2. Esperar a que al menos una opción (además de la de "Selecciona...") esté cargada.
    //    Esto indica que la llamada a la API para obtener las cerraduras ha terminado y se han renderizado.
    //    Buscamos una opción que NO tenga un value vacío.
    wait.until(ExpectedConditions.presenceOfNestedElementLocatedBy(selectLockElement, By.xpath(".//option[@value!='']")));
    // 3. Usar la clase Select para interactuar con el dropdown
    Select lockDropdown = new Select(selectLockElement);    driver.findElement(By.id("input-token")).click();
    lockDropdown.selectByIndex(1);
    driver.findElement(By.id("input-usuario")).sendKeys("cliente@gmail.com");
    driver.findElement(By.id("input-fecha-entrada")).sendKeys("2025-05-06T12:00");
    driver.findElement(By.id("input-fecha-salida")).sendKeys("2025-05-08T21:00");
    driver.findElement(By.id("submit-new-access")).click();

    wait.until(ExpectedConditions.elementToBeClickable(By.id("configure-button-1"))).click();
    driver.findElement(By.id("edit-generate-token-button")).click();
    driver.findElement(By.id("submit-edit-access")).click();

    // Scroll or hover to confirm visual confirmation (opcional)
    
    //WebElement element = driver.findElement(By.id("submit-edit-access"));
    //Actions builder = new Actions(driver);
    //builder.moveToElement(element).perform();
  }
}