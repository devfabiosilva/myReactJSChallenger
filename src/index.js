
import React from 'react';
import ReactDOM from 'react-dom';

import { Resize, ResizeVertical } from "react-resize-layout";

import {UnControlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';

import './index.css';

import "react-vis/dist/style.css";
import "react-vis/dist/styles/legends.scss";

import 
{
	XYPlot, 
	XAxis,
	YAxis,
	HorizontalGridLines,
	LineMarkSeries,
	Hint,
	VerticalGridLines,
	DiscreteColorLegend
}
from 'react-vis';

require('codemirror/mode/javascript/javascript');

const fAuthorName="Fábio";
const fAppTitle = fAuthorName+"'s Challenge";
const fWellcome="//"+fAuthorName+ " react @ console. Type data to plot required result.";

function fgenerateRamdomText()
{
	//console.log(Math.random().toString(36).substring(2));
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let text="";
	let i;
	for (i = 0; i < 5; i++)
	  text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}

class FFooter extends React.Component
{
	constructor(props)
	{
		super(props);
		this.fgenerateGraph=this.fgenerateGraph.bind(this);
	}

	render()
	{
		return <button className="f_generateChartBtn" onClick={this.fgenerateGraph}>Generate graphics</button>
	}

	fgenerateGraph()
	{
		var x=null;
		try
		{
			x=JSON.parse(this.props.fGraphicCode);
		}
		catch (err)
		{
			console.log(err.message)
		}
		if (x)
		{
			var x_tmp=
			{
				title: "Untitled",
				titlex: "Untitled X",
				titley: "Untitled Y",
				gridx: false,
				gridy: false,
				data:[]
			}
			if (x.title)
				x_tmp.title=x.title;
			if (x.titlex)
				x_tmp.titlex=x.titlex;
			if (x.titley)
				x_tmp.titley=x.titley;
			if (x.gridx)
				x_tmp.gridx=x.gridx;
			if (x.gridy)
				x_tmp.gridy=x.gridy;
			if (x.data)
			{

				//x_tmp.data.push(x.data); // Erro aqui FATAL
				x.data.forEach(fdata=>{
					fdata.disabled = ((fdata.disabled)?(fdata.disabled==="false")?false:true:false) //((fdata.disabled==="false")?false:true);
					x_tmp.data.push(
						fdata
					)
				})

				document.fApp.setState
				(
					{
						fgraphics: x_tmp,
						fStart: true
					}
				);
			}
			else
				console.log("Error on parse");
		}
	}
}

class FApp extends React.Component 
{
	constructor(props)
	{
		super(props);
		this.fMapLegendData=this.fMapLegendData.bind(this);
		this.fParseFloat=this.fParseFloat.bind(this);
		this.state =
		{
			fStart:false,
			fgraphics:[],
			fHint: null,
			fGraphicCode: null
		}
	}
	// references @ https://github.com/uber/react-vis/blob/master/showcase/axes/dynamic-hints.js
	hideHint = () => 
	{
		this.setState({
		  fHint: null
		});
	};
	
	showHint = fHint =>
	{
		this.setState({fHint});
	};

	clicTitlekHandler = item => 
	{
		this.state.fgraphics.data.find
		(
			val => 
			{
				if (val.title===item.title)
					val.disabled=!item.disabled;
			}
		)

		this.setState(this.state.fgraphics.data);
	};

	fParseFloat(fdata)
	{
		if (fdata)
		{
			let K=[];
			fdata.forEach(P=>{
				K.push(
					{
						x:parseFloat(P.x),
						y:parseFloat(P.y)
					}
				)
			});
			return K;
		}
		return null;
	}

	fMapLegendData(fdata)
	{
		if (fdata)
		{
			let K=[];
			fdata.forEach(P=>
				{
					K.push(
						{
							title: P.title,
							color: P.color,
							disabled: P.disabled
						}
					)
				});
			return K;
		}
		return null;
	}

	render()
	{

		return (
			<div className="fAppGraphContent">
				<div className="fGraphTitle"><p>{fAppTitle}</p></div>
				<div className="fGraphContent">
					<Resize handleWidth="10px" handleColor="#bebebe" onResizeMove={this.teste}>
						<ResizeVertical id="fcodeHandle" height="200px" minHeight="100px" ref={(fHandleCodeMirror) => {document.fHandleCodeMirror = fHandleCodeMirror}}>
							<CodeMirror id="fcode" ref={(fCodeMirror) => {document.fCodeMirror = fCodeMirror}}
								value={fWellcome}
								options={
									{
										mode: 'javascript',
										theme: 'material',
										lineNumbers: true,
									}
								}
								onChange=
								{
									(editor, data, value) =>
									{
										this.setState
										(
											{
												fGraphicCode: value
											}
										);
									}
								}
							/>

						</ResizeVertical>
						<ResizeVertical height="200px" minHeight="100px">
						{this.state.fStart?
								<div className="fPlot">
								<XYPlot
									width={window.innerWidth - 200}
									height={200}>
									<XAxis
											title={this.state.fgraphics.titlex}
											style={
												{
													line:
													{
														stroke: '#ADDDE1'
													},
													ticks:
													{
														  stroke: '#ADDDE1'
													},
													text: 
													{
														stroke: 'none',
														fill: '#6b6b76',
														fontWeight: 800
													}
												}
											}
									/>
									<YAxis
											title={this.state.fgraphics.titley}
											style={
												{
													line:
													{
														stroke: '#ADDDE1'
													},
													ticks:
													{
														  stroke: '#ADDDE1'
													},
													text: 
													  	{
															stroke: 'none',
															fill: '#6b6b76',
															fontWeight: 800
														}
												}
											}
									/>
									{this.state.fgraphics.gridx?<HorizontalGridLines />:null}
									{this.state.fgraphics.gridy?<VerticalGridLines />:null}
									{this.state.fgraphics.data.map(fdata =>{
										return (
											<LineMarkSeries
												key={fgenerateRamdomText()}
												color={fdata.color}
												onValueMouseOver={this.showHint}
												onValueMouseOut={this.hideHint}
												data={this.fParseFloat(fdata.fvalues)}
												style=
												{
													{
														display: (fdata.disabled)?"none":"block"
													}
												}
												Hint={this.state.fHint}
											/>
										);
									})}
									{this.state.fHint?<Hint value={this.state.fHint} />:null}
								</XYPlot>
								<DiscreteColorLegend
									className="fLegend"
									height={200}
									width={200}
									onItemClick={this.clicTitlekHandler}
									items={this.fMapLegendData(this.state.fgraphics.data)}
								/>
								</div>:<p>Esperando</p>}
  						</ResizeVertical>
    				</Resize>
				</div>
				<div className="fGraphFooter">
					<FFooter fGraphicCode={this.state.fGraphicCode} />
				</div>
    		</div>
		);
	}
}

ReactDOM.render(<FApp ref={(fApp) => document.fApp=fApp}/>, document.getElementById('f_graphic'));
//ReactDOM.render(<FApp />, document.getElementById('f_graphic'));
/*
{
	"title":"Gráfico de frutas",
	"titlex":"Ano",
	"titley":"Crescimento em (%)",
	"gridx": "true",
	"gridy": "true",
	"data":
	[
		{
			"title": "Maçãs",
			"fvalues":
			[
				{"x":"0", "y":"0"},
				{"x":"1", "y":"-1"},
				{"x":"2", "y":"-3"},
				{"x":"3", "y":"5"},
				{"x":"4", "y":"0"},
				{"x":"5", "y":"-1"},
				{"x":"6", "y":"-3"},
				{"x":"7", "y":"5"},
				{"x":"8", "y":"-1"},
				{"x":"9", "y":"-3"},
				{"x":"10", "y":"5"}
			]
		},
		{
			"title": "Bananas",
			"color": "#fc0",
			"fvalues":
			[
				{"x":"0", "y":"7"},
				{"x":"1", "y":"2"},
				{"x":"2", "y":"-6"},
				{"x":"3", "y":"12"},
				{"x":"4", "y":"14"},
				{"x":"5", "y":"14"},
				{"x":"6", "y":"14"},
				{"x":"7", "y":"25"},
				{"x":"8", "y":"1"},
				{"x":"9", "y":"7"},
				{"x":"10", "y":"2"}
			]

		},
		{
			"title": "Melancia",
			"color": "#337",
			"fvalues":
			[
				{"x":"0", "y":"-7"},
				{"x":"1", "y":"-2"},
				{"x":"2", "y":"6"},
				{"x":"3", "y":"-12"},
				{"x":"4", "y":"-14"},
				{"x":"5", "y":"-14"},
				{"x":"6", "y":"-14"},
				{"x":"7", "y":"-25"},
				{"x":"8", "y":"-1"},
				{"x":"9", "y":"-7"},
				{"x":"10", "y":"-2"}
			]
		},
		{
			"title": "Uva",
			"color": "#3329",
			"fvalues":
			[
				{"x":"0", "y":"71"},
				{"x":"1", "y":"20"},
				{"x":"2", "y":"60"},
				{"x":"3", "y":"12"},
				{"x":"4", "y":"14"},
				{"x":"5", "y":"16"},
				{"x":"6", "y":"24"},
				{"x":"7", "y":"28"},
				{"x":"8", "y":"-10"},
				{"x":"9", "y":"52"},
				{"x":"10", "y":"26"}
			]
		},
		{
			"title": "Melão",
			"color": "#26401",
			"fvalues":
			[
				{"x":"0", "y":"37"},
				{"x":"1", "y":"29"},
				{"x":"2", "y":"2"},
				{"x":"3", "y":"0"},
				{"x":"4", "y":"91"},
				{"x":"5", "y":"78"},
				{"x":"6", "y":"64"},
				{"x":"7", "y":"18"},
				{"x":"8", "y":"-25"},
				{"x":"9", "y":"52"},
				{"x":"10", "y":"19"}
			]
		},
		{
			"title": "Mamão",
			"fvalues":
			[
				{"x":"0", "y":"72"},
				{"x":"1", "y":"23"},
				{"x":"2", "y":"-20"},
				{"x":"3", "y":"1"},
				{"x":"4", "y":"41"},
				{"x":"5", "y":"-18"},
				{"x":"6", "y":"24"},
				{"x":"7", "y":"6"},
				{"x":"8", "y":"-20"},
				{"x":"9", "y":"12"},
				{"x":"10", "y":"23"}
			]
		}
	]
}
*/
