// Use the D3 library to read in samples.json from URL https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json.

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";


//Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.


//dropdown menu
function init() {
    let selection = d3.select("#selDataset");
    d3.json(url).then(data => {
        let datanames = data.names;
        datanames.forEach(element => {
            selection.append("option")
            .text(element)
            .property("value", element);
            
        });
        //user data selection to use in the charts
        let chartdata = data.samples[0]  
        charts(chartdata)
        let paneldat = data.metadata[0]
        metadata(paneldat)
    });

}

//Set a funtion to plot the top 10 of the data 

function charts(plotdata){                         //Create a barchart
   let barchart = [{
    x: plotdata.sample_values.slice(0,10).reverse(),
    y: plotdata.otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse(),
    text: plotdata.otu_labels.slice(0,10).reverse(),
    type: "bar",
    orientation: "h"
   }];
   let barlayout = {
    title: 'Top 10 OTUs',
    xaxis: { title: "Sample Values" },
    yaxis: { title: "OTU IDs" }
  };
  Plotly.newPlot("bar", barchart, barlayout);


  //Create a bubble chart that displays each sample.
  let bubbleplot = [{                           
    x: plotdata.otu_ids,
    y: plotdata.sample_values,
    text: plotdata.otu_labels,
    mode: "markers",
    marker: {
        size: plotdata.sample_values,
        color: plotdata.otu_ids    //i wanted to increase contrast of the colors but didnt find a way to.
        }
   }];

   let bubble_labels = {
    title: 'Top 10 OTUs',
    xaxis: { title: "OTU IDs" },
    yaxis: { title: "Simple Values" }
  };
  Plotly.newPlot("bubble", bubbleplot, bubble_labels);
}

// set funtion for metadata

function metadata(meta){
    let metapanel =d3.select("#sample-metadata");
    metapanel.html('');
    Object.entries(meta).forEach(([key,value])=>{metapanel.append("h5").text(`${key} : ${value}`)});
}

//swapping funtion for values

function optionChanged(selectid){
    d3.json(url).then(data => {
        let filterdata = data.samples.filter(row => row.id==selectid)
        charts(filterdata[0])
        let filtermeta = data.metadata.filter(row => row.id==selectid)
        metadata(filtermeta[0])
    })
}

init();
