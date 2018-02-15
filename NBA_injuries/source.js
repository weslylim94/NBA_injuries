(function(){
  var selector1 = d3.select("#selector1");
  var selector2 = d3.select("#selector2");

  var injured = ["Stats Per Game Played", "Stats Over 82 Games"];
  var seasons = ["2012-13", "2013-14", "2014-15", "All 3 Seasons"];

  selector1
    .selectAll("option")
    .data(seasons)
    .enter()
    .append("option")
      .text(function(d){ return d; })
      .attr("value", function(d){ return d; });

  selector2
    .selectAll("option")
    .data(injured)
    .enter()
    .append("option")
      .text(function(d){ return d; })
      .attr("value", function(d){ return d; });
  // Define the data as a two-dimensional array of numbers. If you had other
  // data to associate with each number, replace each number with an object, e.g.,
  // `{key: "value"}`.


  // Define the margin, radius, and color scale. The color scale will be
  // assigned by index, but if you define your data using objects, you could pass
  // in a named field from the data object instead, such as `d.name`. Colors
  // are assigned lazily, so if you want deterministic behavior, define a domain
  // for the color scale.



  var margin = {top: 60, right: 20, bottom: 70, left: 60},
      width = 500 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // Parse the date / time

  var y = d3.scale.linear()           
              .domain([0,4])
              .range([0,190]);


  var x = d3.scale.linear()
              .domain([10,25])
              .range([0,50]);;

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .ticks(10);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

  var yAxis2 = d3.svg.axis()
      .scale(y)
      .orient("left");




  // Get the data
  // Name,Season,Age,Tm,Lg,Pos,G,GS,MP,FG,FGA,FG%,3P,3PA,3P%,2P,2PA,2P%,eFG%,FT,FTA,FT%,ORB,DRB,TRB,AST,STL,BLK,TOV,PF,PTS
  d3.csv("big_injury.csv", function(error, data) {
    data.forEach(function(d) {
      d.Name = d.Name;
      d.Season = d.Season;
      d.Age = +d.Age;
      d.G = +d.G;
      d.FG = +d.FG;
      d.FGA = +d.FGA;
      d.FT = +d.FT;
      d.FTA = +d.FTA;
      d.TRB = +d.TRB;
      d.AST = +d.AST;
      d.STL = +d.STL;
      d.BLK = +d.BLK;
      d.TOV = +d.TOV;
      d.PTS = +d.PTS;
    });


  // variables
    var data1 = [];
    var data2 = [];
    var data3 = [];
    var dataAvg = [];
    var pieData1 = [];
    var pieData2 = [];
    var pieData3 = [];
    var pieDataAvg = [];
    for(i = 0; i < data.length; i++){
      if(data[i].Season == "2012-13"){
        data1.push(data[i])
        pieData1.push([data[i].G, 82-data[i].G]);
      } else if(data[i].Season == "2013-14"){
        data2.push(data[i]);
        pieData2.push([data[i].G, 82-data[i].G]);
      } else if(data[i].Season == "2014-15"){
        data3.push(data[i]);
        pieData3.push([data[i].G, 82-data[i].G]);
      }
    }
  //Math.round(10*(d.BLK * adjust))/10 + " " + stat; 
    for(i = 0; i < pieData1.length; i++){
      pieDataAvg.push([Math.round(10*(pieData1[i][0] + pieData2[i][0] + pieData3[i][0])/3)/10,
       Math.round(10*(pieData1[i][1] + pieData2[i][1] + pieData3[i][1])/3)/10]);
    }

    for(i = 0; i < data1.length; i++){
      var temp = {};
      temp["Name"] = data1[i].Name;
      temp["G"] = (Math.round(10*(data1[i].G + data2[i].G + data3[i].G)/3)/10);
      temp["PTS"] = (Math.round(10*(data1[i].PTS + data2[i].PTS + data3[i].PTS)/3)/10);
      temp["TRB"] = (Math.round(10*(data1[i].TRB + data2[i].TRB + data3[i].TRB)/3)/10);
      temp["STL"] = (Math.round(10*(data1[i].STL + data2[i].STL + data3[i].STL)/3)/10);
      temp["BLK"] = (Math.round(10*(data1[i].BLK + data2[i].BLK + data3[i].BLK)/3)/10);
      temp["TOV"] = (Math.round(10*(data1[i].TOV + data2[i].TOV + data3[i].TOV)/3)/10);
      temp["AST"] = (Math.round(10*(data1[i].AST + data2[i].AST + data3[i].AST)/3)/10);
      // console.log(temp);
      dataAvg.push(temp);
    }
    console.log(dataAvg);

    var m = 10,
        r = 120,
        z = d3.scale.category20c();


    var arc = d3.svg.arc()
        .outerRadius(r)
        .innerRadius(0);


    var tooltipPie = d3.select("body")
      .data(data)
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden");

  //
  //
  // THIS IS THE PIE CHART
  //
  //

    function drawPie(season){
      d3.selectAll("svg").remove();
      console.log("change");

      var svg = d3.select("body").selectAll("svg")
          .data(season)
        .enter().append("svg")
          .attr("width", (r + m) * 2)
          .attr("height", (r + m) * 2)
        .append("g")
          .attr("transform", "translate(" + (r + m) + "," + (r + m) + ")");

      
      svg.selectAll("path")
          .data(d3.layout.pie())
        .enter().append("path")
          .attr("d", d3.svg.arc()
              .innerRadius(r / 2)
              .outerRadius(r))
          .style("fill", function(d, i) { return z(i); })
            .transition()
              .duration(2000)
              .attrTween("d", tweenPie);

      var pic = ["AD.png", "Demarcus.png", "millsap.png", "ibaka.png"];
      var name = ["Anthony Davis", "DeMarcus Cousins", "Paul Millsap", "Serge Ibaka"];
      var cur = 0;
      var curN = 0;
      svg.append("svg:image")
          .attr("x", -60)             
          .attr("y", -70)
          .attr('width', 120)
          .attr('height', 120)
          .attr("xlink:href", function(){
            cur = cur + 1;
            return pic[cur - 1];
          })
      
      svg.append("text")
          .attr("x", (0))             
          .attr("y", 50)
          .attr("text-anchor", "middle")  
          .style("font-size", "18px") 
          .text(function(){
            curN = curN + 1;
            return name[curN - 1];
          })
          .style("opacity", 0.5);

      svg.data(season).append("text")
          .attr("x", (0))             
          .attr("y", 65)
          .attr("text-anchor", "middle")  
          .style("font-size", "14px") 
          .text(function(d){
            return d[0] + " Games played";
          })
          .style("opacity", 0.4);
    }

  //
  //
  // THESE ARE THE GRAPHS
  //
  //

    function draw(stat, season, injury){
      d3.selectAll(".pie" + stat).remove();
      var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("class", "pie" + stat)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

      x.domain(data.map(function(d) { return d.TRB; }));
      y.domain([0, d3.max(data, function(d) { return d.Name; })]);

      var tooltip = d3.select("body")
        .data(data)
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end");

      svg.selectAll("bar")
          .data(season)
        .enter().append("rect")
          .style("fill", function(d){
            if(d.Name == "Serge Ibaka" || d.Name == "Paul Millsap"){
              return "steelblue";
            } else {
              return z(1);
            }
          })
          .attr("x", function(d) { return 0; })
          .attr("width", 0)
            .transition()
            .duration(600)
            .delay(function (d, i) {
              return i * 50;
          })
          .attr("width", function(d) {
            if(inj_bool == 0){
              if(stat == "Blocks"){ 
                return d.BLK * 80; 
              } else if(stat == "Steals"){
                return d.STL * 130;
              } else if(stat == "Points"){
                return d.PTS * 10;
              } else if(stat == "Rebounds"){
                return d.TRB * 20;
              } else if(stat == "Assists"){
                return d.AST * 80;
              } else if(stat == "Turnovers"){
                return d.TOV * 80;
              }
            } else if(inj_bool == 1){
              var adjust = d.G / 82
              if(stat == "Blocks"){ 
                return d.BLK * 80 * adjust; 
              } else if(stat == "Steals"){
                return d.STL * 130 * adjust;
              } else if(stat == "Points"){
                return d.PTS * 10 * adjust;
              } else if(stat == "Rebounds"){
                return d.TRB * 20 * adjust;
              } else if(stat == "Assists"){
                return d.AST * 80 * adjust;
              } else if(stat == "Turnovers"){
                return d.TOV * 80 * adjust;
              }
            }
          })
          .attr("y", function(d) { 
            if(d.Name == "Anthony Davis") { 
              return 150; 
            } else if(d.Name == "DeMarcus Cousins"){ 
              return 100; 
            } else if(d.Name == "Paul Millsap"){ 
              return 50; 
            } else if(d.Name == "Serge Ibaka"){ 
              return 0; 
            }
          })
          .attr("height", function(d) { return 40; });
          
          svg.selectAll("bar")
              .data(season)
              .enter().append("text")
              .attr("class", "label")
              .attr("y", function(d){
                if(d.Name == "Anthony Davis") { 
                  return 150 + 20; 
                } else if(d.Name == "DeMarcus Cousins"){ 
                  return 100 + 20; 
                } else if(d.Name == "Paul Millsap"){ 
                  return 50 + 20; 
                } else if(d.Name == "Serge Ibaka"){ 
                  return 0 + 20; 
                }
              })
              .attr("dy", ".35em") //vertical align middle
              .attr("x", function(d){
            if(inj_bool == 0){
              if(stat == "Blocks"){ 
                return d.BLK * 80 + 5; 
              } else if(stat == "Steals"){
                return d.STL * 130 + 5;
              } else if(stat == "Points"){
                return d.PTS * 10 + 5;
              } else if(stat == "Rebounds"){
                return d.TRB * 20 + 5;
              } else if(stat == "Assists"){
                return d.AST * 80 + 5;
              } else if(stat == "Turnovers"){
                return d.TOV * 80 + 5;
              }
            } else if(inj_bool == 1){
              var adjust = d.G / 82
              if(stat == "Blocks"){ 
                return d.BLK * 80 * adjust + 5; 
              } else if(stat == "Steals"){
                return d.STL * 130 * adjust + 5;
              } else if(stat == "Points"){
                return d.PTS * 10 * adjust + 5;
              } else if(stat == "Rebounds"){
                return d.TRB * 20 * adjust + 5;
              } else if(stat == "Assists"){
                return d.AST * 80 * adjust + 5;
              } else if(stat == "Turnovers"){
                return d.TOV * 80 * adjust + 5;
              }
            }
              })
              .text(function(d){
                var txt = ""
                var adjust = d.G / 82;
                if(inj_bool == 0){
                  if(stat == "Blocks"){ 
                    txt = d.BLK + " " + stat; 
                  } else if(stat == "Points"){
                    txt = d.PTS + " " + stat; 
                  } else if(stat == "Rebounds"){
                    txt = d.TRB + " " + stat; 
                  } else if(stat == "Steals"){
                    txt = d.STL + " " + stat; 
                  } else if(stat == "Assists"){
                    txt = d.AST + " " + stat; 
                  } else if(stat == "Turnovers"){
                    txt = d.TOV + " " + stat; 
                  } 
                } else if(inj_bool == 1){
                  if(stat == "Blocks"){ 
                    txt = Math.round(10*(d.BLK * adjust))/10 + " " + stat; 
                  } else if(stat == "Points"){
                    txt = Math.round(10*(d.PTS * adjust))/10 + " " + stat; 
                  } else if(stat == "Rebounds"){
                    txt = Math.round(10*(d.TRB * adjust))/10 + " " + stat; 
                  } else if(stat == "Steals"){
                    txt = Math.round(10*(d.STL * adjust))/10 + " " + stat; 
                  } else if(stat == "Assists"){
                    txt = Math.round(10*(d.AST * adjust))/10 + " " + stat; 
                  } else if(stat == "Turnovers"){
                    txt = Math.round(10*(d.TOV * adjust))/10 + " " + stat; 
                  } 
                }
                return txt;
              }).each(function() {
                labelWidth = Math.ceil(Math.max(20, this.getBBox().width));
          })
          .style("opacity", 0.5);

      svg.append("text")
            .attr("x", (width / 5))             
            .attr("y", 0 - (margin.top / 3))
            .attr("text-anchor", "middle")  
            .style("font-size", "16px") 
            .style("opacity", 0.6)
            .text(stat);

      var images = svg.append("svg:image")
        .attr("xlink:href",  function(d) { return "ibaka.png";})
        .attr("x", function(d) { return -60;})
        .attr("y", function(d) { return 0;})
        .attr("height", 40)
        .attr("width", 60);

      var images = svg.append("svg:image")
        .attr("xlink:href",  function(d) { return "millsap.png";})
        .attr("x", function(d) { return -60;})
        .attr("y", function(d) { return 50;})
        .attr("height", 40)
        .attr("width", 60);

      var images = svg.append("svg:image")
        .attr("xlink:href",  function(d) { return "demarcus.png";})
        .attr("x", function(d) { return -60;})
        .attr("y", function(d) { return 100;})
        .attr("height", 40)
        .attr("width", 60);

      var images = svg.append("svg:image")
        .attr("xlink:href",  function(d) { return "AD.png";})
        .attr("x", function(d) { return -60;})
        .attr("y", function(d) { return 150;})
        .attr("height", 40)
        .attr("width", 60);
    }

    var inj_bool = 0;
    var curr_data = data1;
    selector1
        .on("change", function(){
          var value = selector1.property("value");
          if(value == "2012-13"){
                curr_data = data1;
                drawPie(pieData1);
                draw("Points", data1, inj_bool);
                draw("Rebounds", data1, inj_bool);
                draw("Blocks", data1, inj_bool);
                draw("Steals", data1, inj_bool);
                draw("Assists", data1, inj_bool);
                draw("Turnovers", data1, inj_bool);
          } else if(value == "2013-14"){
                curr_data = data2;
                drawPie(pieData2);
                draw("Points", data2, inj_bool);
                draw("Rebounds", data2, inj_bool);
                draw("Blocks", data2, inj_bool);
                draw("Steals", data2, inj_bool);
                draw("Assists", data2, inj_bool);
                draw("Turnovers", data2, inj_bool);
          } else if(value == "2014-15"){
                curr_data = data3;
                drawPie(pieData3);
                draw("Points", data3, inj_bool);
                draw("Rebounds", data3, inj_bool);
                draw("Blocks", data3, inj_bool);
                draw("Steals", data3, inj_bool);
                draw("Assists", data3, inj_bool);
                draw("Turnovers", data3, inj_bool);
          } else if(value == "All 3 Seasons"){
                curr_data = dataAvg;
                drawPie(pieDataAvg);
                draw("Points", dataAvg, inj_bool);
                draw("Rebounds", dataAvg, inj_bool);
                draw("Blocks", dataAvg, inj_bool);
                draw("Steals", dataAvg, inj_bool);
                draw("Assists", dataAvg, inj_bool);
                draw("Turnovers", dataAvg, inj_bool);          
          }
        });

    selector2
        .on("change", function(){
          var value = selector2.property("value");
          if(value == "Stats Per Game Played"){
                inj_bool = 0;
                draw("Points", curr_data, inj_bool);
                draw("Rebounds", curr_data, inj_bool);
                draw("Blocks", curr_data, inj_bool);
                draw("Steals", curr_data, inj_bool);
                draw("Assists", curr_data, inj_bool);
                draw("Turnovers", curr_data, inj_bool);
                console.log(inj_bool);
          } else if(value == "Stats Over 82 Games"){
                inj_bool = 1;
                draw("Points", curr_data, inj_bool);
                draw("Rebounds", curr_data, inj_bool);
                draw("Blocks", curr_data, inj_bool);
                draw("Steals", curr_data, inj_bool);
                draw("Assists", curr_data, inj_bool);
                draw("Turnovers", curr_data, inj_bool);
                console.log(inj_bool);
          } 
        });

      drawPie(pieData1);
      draw("Points", data1, 0);
      draw("Rebounds", data1, 0);
      draw("Blocks", data1, 0);
      draw("Steals", data1, 0);
      draw("Assists", data1, 0);
      draw("Turnovers", data1, 0);

      function tweenPie(b) {
        b.innerRadius = 0;
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) { return arc(i(t)); };
      }
  });
})();


