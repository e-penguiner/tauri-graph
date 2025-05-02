// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use num_integer::Integer;
use serde::Serialize;
use std::f64::consts::PI;

#[derive(Serialize)]
struct PlotData {
    series: Vec<SeriesData>,
}

#[derive(Serialize)]
struct SeriesData {
    name: String,
    x: Vec<f64>,
    y: Vec<f64>,
}

#[tauri::command]
fn get_plot_data(
    r1: Option<f64>,
    r2: Option<f64>,
    d: Option<f64>,
    n: Option<i64>,
    m: Option<i64>,
) -> PlotData {
    let r1 = r1.unwrap_or(5.0);
    let r2 = r2.unwrap_or(3.0);
    let d = d.unwrap_or(1.0);
    let n = n.unwrap_or(3);
    let m = m.unwrap_or(2);

    hypocycloid(r1, r2, d, n, m, 10000)
} // cargo add num-integer

fn hypocycloid(r1: f64, r2: f64, d: f64, n: i64, m: i64, num_points: u64) -> PlotData {
    assert!(d != 0.0, "d should not be 0");
    assert!(r2 < r1, "should be r2 < r1");

    let gcd = n.gcd(&m);
    let period = (m / gcd) as f64;
    let nm_ratio = (n as f64) / (m as f64);
    let k = (r1 - r2) / r2;
    let mut xs = Vec::with_capacity(num_points as usize);
    let mut ys = Vec::with_capacity(num_points as usize);
    for i in 0..num_points {
        let t = 2.0 * PI * period * (i as f64) / (num_points as f64);
        let theta = t * nm_ratio;
        let phi = k * theta;
        xs.push((r1 - r2) * theta.cos() + r2 / d * phi.cos());
        ys.push((r1 - r2) * theta.sin() - r2 / d * phi.sin());
    }
    PlotData {
        series: vec![SeriesData {
            name: "Hypocycloid".into(),
            x: xs,
            y: ys,
        }],
    }
}
fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_plot_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
