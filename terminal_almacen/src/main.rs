use colored::Colorize;
use dialoguer::{Input, Select};
use serde::{Deserialize, Serialize};
use std::process::exit;

#[derive(Serialize)]
struct LoginRequest {
    username: String,
    password: String,
}

#[derive(Deserialize)]
struct LoginResponse {
    access_token: String,
    role: String,
}

#[derive(Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Medicamento {
    id: i32,
    nombre: String,
    lote: String,
    cantidad: i32,
    fecha_vencimiento: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct NuevoMedicamento {
    nombre: String,
    lote: String,
    cantidad: i32,
    fecha_vencimiento: String,
}

const API_BASE_URL: &str = "http://farma_proxy/api";

fn main() {
    println!("{}", "🛡️  SISTEMA DE INVENTARIO FARMACÉUTICO (VLAN 210)".bright_blue().bold());
    println!("{}", "------------------------------------------------".bright_blue());

    let username: String = Input::new()
        .with_prompt("👤 Usuario LDAP")
        .interact_text()
        .unwrap();

    let password: String = Input::new()
        .with_prompt("🔒 Contraseña")
        .interact()
        .unwrap();

    println!("\n⏳ Conectando con el Directorio Activo...");

    let client = reqwest::blocking::Client::new();
    let login_payload = LoginRequest {
        username: username.clone(),
        password,
    };

    let response = client
        .post(format!("{}/auth/login", API_BASE_URL))
        .header("Host", "intranet.farmaceutica.local")
        .json(&login_payload)
        .send();

    match response {
        Ok(res) => {
            if res.status().is_success() {
                let auth_data: LoginResponse = res.json().unwrap();
                println!(
                    "{}",
                    format!("✅ Autenticación exitosa. Rol: {}", auth_data.role).bright_green()
                );
                menu_principal(&client, &auth_data.access_token, &username);
            } else {
                let status = res.status();
                let body = res.text().unwrap_or_default();
                println!(
                    "{}",
                    format!("❌ Error de autenticación: {} - {}", status, body).bright_red()
                );
                exit(1);
            }
        }
        Err(e) => {
            println!(
                "{}",
                format!("❌ No se pudo conectar con el servidor: {}", e).bright_red()
            );
            println!(
                "{}",
                "💡 Verifica que estás ejecutando esto dentro del contenedor 'pc_almacen_01' o que el proxy esté activo.".yellow()
            );
            exit(1);
        }
    }
}

fn menu_principal(client: &reqwest::blocking::Client, token: &str, username: &str) {
    loop {
        println!("\n{}", format!("👋 Bienvenido, {}", username).bright_cyan());
        let opciones = vec![
            "📦 Ver Inventario",
            "➕ Agregar Medicamento",
            "🚪 Cerrar Sesión",
        ];

        let seleccion = Select::new()
            .with_prompt("Selecciona una opción")
            .items(&opciones)
            .default(0)
            .interact()
            .unwrap();

        match seleccion {
            0 => ver_inventario(client, token),
            1 => agregar_medicamento(client, token),
            2 => {
                println!("{}", "👋 Sesión cerrada. Hasta luego.".bright_yellow());
                exit(0);
            }
            _ => unreachable!(),
        }
    }
}

fn ver_inventario(client: &reqwest::blocking::Client, token: &str) {
    println!("\n⏳ Consultando base de datos...");
    let res = client
        .get(format!("{}/inventario", API_BASE_URL))
        .header("Host", "intranet.farmaceutica.local")
        .header("Authorization", format!("Bearer {}", token))
        .send();

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let meds: Vec<Medicamento> = response.json().unwrap();
                println!("{}", "\n📋 INVENTARIO ACTUAL:".bright_green().bold());
                println!(
                    "{:<5} | {:<25} | {:<10} | {:<8} | {}",
                    "ID", "NOMBRE", "LOTE", "CANT.", "VENCIMIENTO"
                );
                println!("{}", "-".repeat(75));
                for med in meds {
                    println!(
                        "{:<5} | {:<25} | {:<10} | {:<8} | {}",
                        med.id, med.nombre, med.lote, med.cantidad, med.fecha_vencimiento
                    );
                }
            } else {
                let status = response.status();
                let body = response.text().unwrap_or_default();
                println!(
                    "{}",
                    format!("❌ Error al obtener datos: {} - {}", status, body).bright_red()
                );
            }
        }
        Err(e) => println!("{}", format!("❌ Error de red: {}", e).bright_red()),
    }
}

fn agregar_medicamento(client: &reqwest::blocking::Client, token: &str) {
    println!("\n{}", "➕ REGISTRAR NUEVO LOTE".bright_yellow().bold());

    let nombre: String = Input::new()
        .with_prompt("Nombre del medicamento")
        .interact_text()
        .unwrap();
    let lote: String = Input::new()
        .with_prompt("Código de Lote")
        .interact_text()
        .unwrap();
    let cantidad: i32 = Input::new()
        .with_prompt("Cantidad")
        .interact_text()
        .unwrap();
    let fecha: String = Input::new()
        .with_prompt("Fecha de Vencimiento (YYYY-MM-DD)")
        .interact_text()
        .unwrap();

    let payload = NuevoMedicamento {
        nombre,
        lote,
        cantidad,
        fecha_vencimiento: fecha,
    };

    let res = client
        .post(format!("{}/inventario", API_BASE_URL))
        .header("Host", "intranet.farmaceutica.local")
        .header("Authorization", format!("Bearer {}", token))
        .json(&payload)
        .send();

    match res {
        Ok(response) => {
            if response.status().is_success() {
                let body = response.text().unwrap_or_default();
                println!(
                    "{}",
                    format!("✅ Medicamento registrado exitosamente en PostgreSQL. {}", body)
                        .bright_green()
                );
            } else {
                let status = response.status();
                let body = response.text().unwrap_or_default();
                println!(
                    "{}",
                    format!("❌ Error al guardar: {} - {}", status, body).bright_red()
                );
            }
        }
        Err(e) => println!("{}", format!("❌ Error de red: {}", e).bright_red()),
    }
}