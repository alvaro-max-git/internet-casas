package es.upm.dit.isst.ioh_api;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.AfterEach;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.time.Duration;

public class HostTest {
  private WebDriver driver;
  private WebDriverWait wait;
  private JavascriptExecutor js;

  @BeforeEach
  public void setUp() {
    driver = new FirefoxDriver();
    wait   = new WebDriverWait(driver, Duration.ofSeconds(10));
    js     = (JavascriptExecutor) driver;
  }

  @AfterEach
  public void tearDown() {
    driver.quit();
  }

  @Test
  public void host() throws InterruptedException {
    // 1) Registro de host
    driver.get("http://localhost:5173/register");
    driver.manage().window().setSize(new Dimension(1086, 692));
    driver.findElement(By.id("register-button")).click();
    driver.findElement(By.id("host-register-button")).click();
    driver.findElement(By.name("email")).sendKeys("host@host.com");
    driver.findElement(By.name("password")).sendKeys("1234");
    driver.findElement(By.name("seamApiKey"))
          .sendKeys("seam_test2L3y_93S42w47iUvh5D9YU8USEdtR");
    driver.findElement(By.id("host-register-button-confirm")).click();

    // 2) Esperar a que cargue AdminHome
    wait.until(ExpectedConditions.urlContains("/admin/home"));

    // 3) Clic en “Agregar acceso”
    WebElement addCard = wait.until(
      ExpectedConditions.elementToBeClickable(By.id("add-access-card"))
    );
    addCard.click();

    // 4) Esperar que el <select> tenga opciones
    By optionsLocator = By.cssSelector("#select-lock option");
    wait.until(ExpectedConditions.numberOfElementsToBeMoreThan(optionsLocator, 1));

    // 5) Seleccionar la primera cerradura real
    driver.findElement(By.cssSelector("#select-lock option:nth-child(2)")).click();

    // 6) Rellenar token y usuario
    driver.findElement(By.id("input-token")).click();
    driver.findElement(By.id("input-usuario")).sendKeys("cliente@gmail.com");

    // 7) Rellenar fechas usando valueAsDate + dispatchEvent
    WebElement entrada = driver.findElement(By.id("input-fecha-entrada"));
    WebElement salida  = driver.findElement(By.id("input-fecha-salida"));

    String jsSetDate = """
      arguments[0].valueAsDate = new Date(arguments[1]);
      arguments[0].dispatchEvent(new Event('input', { bubbles: true }));
      arguments[0].dispatchEvent(new Event('change', { bubbles: true }));
    """;

    // fijamos 07-may-2025 12:00 y 09-may-2025 12:00
    js.executeScript(jsSetDate, entrada, "2025-05-07T12:00:00");
    js.executeScript(jsSetDate, salida,  "2025-06-09T12:00:00");

    // ─── Logs para depurar ───
    System.out.println("🛈 [DEBUG] Fecha entrada (DOM) = " + entrada.getAttribute("value"));
    System.out.println("🛈 [DEBUG] Fecha salida  (DOM) = " + salida.getAttribute("value"));
    // ─────────────────────────

    // 8) Crear el acceso
    driver.findElement(By.id("submit-new-access")).click();

    // 9) Pequeña espera antes del logout
    Thread.sleep(2000);

    // 10) Logout vía IDs
    wait.until(ExpectedConditions.elementToBeClickable(By.id("menu-hamburguesa"))).click();
    wait.until(ExpectedConditions.elementToBeClickable(By.id("menu-cerrar-sesion"))).click();
  }
}