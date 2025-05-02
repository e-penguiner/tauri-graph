import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import Plot from "react-plotly.js";
import "./App.css";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  Container,
} from "@mui/material";

function App() {
  const [plotData, setPlotData] = useState(null);
  const [params, setParams] = useState({
    r1: 5.0,
    r2: 3.0,
    d: 1.0,
    n: 3,
    m: 2,
    num_points: 10000,
  });

  const updatePlot = async () => {
    try {
      // Extract parameters excluding num_points
      const { num_points, ...apiParams } = params;
      const data = await invoke("get_plot_data", apiParams);

      const plotSeries = data.series.map((series) => ({
        x: series.x,
        y: series.y,
        type: "scatter",
        name: series.name,
        mode: "lines",
        line: { width: 2 },
      }));

      setPlotData(plotSeries);
    } catch (error) {
      console.error("Error fetching plot data:", error);
    }
  };

  useEffect(() => {
    updatePlot();
  }, []);

  const handleFloatChange = (param) => (event) => {
    const value = parseFloat(event.target.value);
    if (!isNaN(value)) {
      setParams((prev) => ({
        ...prev,
        [param]: value,
      }));
    }
  };

  const handleIntChange = (param) => (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value)) {
      setParams((prev) => ({
        ...prev,
        [param]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePlot();
  };

  const paramLabels = {
    r1: "Outer radius (R)",
    r2: "Inner radius (r)",
    d: "Distance (d)",
    n: "Numerator (n)",
    m: "Denominator (m)",
    num_points: "Points",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Hypocycloid Curve
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label={paramLabels.r1}
                type="number"
                inputProps={{ step: "0.1" }}
                value={params.r1}
                onChange={handleFloatChange("r1")}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label={paramLabels.r2}
                type="number"
                inputProps={{ step: "0.1" }}
                value={params.r2}
                onChange={handleFloatChange("r2")}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label={paramLabels.d}
                type="number"
                inputProps={{ step: "0.1" }}
                value={params.d}
                onChange={handleFloatChange("d")}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label={paramLabels.n}
                type="number"
                inputProps={{ step: "1" }}
                value={params.n}
                onChange={handleIntChange("n")}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                label={paramLabels.m}
                type="number"
                inputProps={{ step: "1" }}
                value={params.m}
                onChange={handleIntChange("m")}
                fullWidth
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          height: "calc(100vh - 250px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {plotData ? (
          <Plot
            data={plotData}
            layout={{
              title: "Hypocycloid Curve",
              autosize: true,
              xaxis: {
                scaleanchor: "y",
                scaleratio: 1,
              },
              margin: { l: 50, r: 50, b: 50, t: 80 },
            }}
            config={{
              displayModeBar: false,
            }}
            style={{ width: "100%", height: "100%" }}
            useResizeHandler={true}
          />
        ) : (
          <Typography variant="h6">Loading plot data...</Typography>
        )}
      </Paper>
    </Container>
  );
}

export default App;
