import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';
import * as data from './client.json';
import * as product from './product.json';

class App extends Component {
  constructor(props) {
    super(props);
    this.clientChange = this.clientChange.bind(this);
    this.addRow = this.addRow.bind(this);
    //this.deleteRow = this.deleteRow.bind(this,rowindex);
    //this.changeProduct = this.changeProduct.bind(this);
    this.printBill = this.printBill.bind(this);
    this.state = {
      selectedGST: '', clients: [], selectedClient: {}, 
      productList: JSON.parse(JSON.stringify(product)), currentBill: []
    };

  }
  componentDidMount() {
    this.setState({ clients: JSON.parse(JSON.stringify(data)) });
  }
  printBill(e){
    e.preventDefault();

  }
  clientChange(e) {
    e.preventDefault();
    //let selectedClient = this.state.clients.filter( d => d.id.toString() === e.target.value );
    let value = '';
    let client = {};
    //this.state.clients.filter( (d) => d.id.toString() === e.target.value);
    this.state.clients.forEach(function (d) {

      if (d.id.toString() === e.target.value) {
        value = d.GST_NO;
        client = d;
      }

    }, this);
    this.setState({ selectedGST: value, selectedClient: client });
    //localStorage.getItem();
  }
  addRow(e) {
    e.preventDefault();
    let updateBill = [...this.state.currentBill, {
      rowIndex: this.state.currentBill.length + 1,
      ProductID: 0,
      BasePrice: 0.00,      
      Qty: 0,
      SGST: "",
      CGST: "",
      Total:0 ,
      GstPrice :""
    }];
    this.setState({ currentBill: updateBill });
  }
  deleteRow(rowindex,e) {
    e.preventDefault();
    //alert(rowindex);
    let billedItem = [];
    let index = 1;
    this.state.currentBill.forEach(function (data) {
      if (data.rowIndex !== rowindex) {
      
        billedItem.push(Object.assign({},data,{rowIndex : index}));
        index = index + 1;
      } 

      
    });
    
    this.setState({ currentBill: billedItem });
  }
  changeQty(rowindex,e){
    e.preventDefault();
    let udpatedProduct = this.state.currentBill.map(data => {
      if (data.rowIndex === rowindex) {
        let totalGst = 0;
        let sGst,cGst, targetPrice, cgstPrice, sgstPrice,igstPrice;
        let basePrice =0.00;
        let qty = 0;
        let gstPrice =0;
        if(e.target.value !== '' && Number.isNaN(e.target.value) == false)
        {
          qty = parseFloat(e.target.value);
        }
        if(data.IsIGSTEnabled)
        {
          totalGst = data.IGST;
          sGst = 0;
          cGst = 0;          
          basePrice = data.TargetPrice / (1+(totalGst/100));
          gstPrice =  (basePrice * (totalGst/100)) *qty;
          sgstPrice =0;
          cgstPrice =0;
          igstPrice = gstPrice;
        }
        else{
          sGst=  parseFloat(data.SGST);
          cGst=  parseFloat(data.CGST);          
          let gstvalue = (sGst/100) + (cGst/100);
          basePrice = data.TargetPrice / (1+ gstvalue);
          //gstPrice =  (basePrice * ((sGst/100) +(cGst/100))) * qty;
          //gstPrice = (data.TargetPrice / (1+ gstvalue)) *(gstvalue)* qty;
          sgstPrice = basePrice * (sGst/100);
          igstPrice =0;
          cgstPrice = basePrice * (cGst /100);
          gstPrice= (parseFloat( sgstPrice.toFixed(3)) + parseFloat( cgstPrice.toFixed(3)) ) *qty;
        }
        targetPrice = data.TargetPrice;
        //let prod;
        //this.state.productList.forEach(function (p) { if (p.ProductID.toString() === e.target.value) { prod = p; } });
        return Object.assign({}, data, {          
          Qty: e.target.value,          
          BasePrice:  basePrice.toFixed(3),
          Total: (parseFloat(qty) * parseFloat(data.TargetPrice)).toFixed(3),
          GstPrice :gstPrice.toFixed(3),
          IGSTPrice: igstPrice.toFixed(3),
          CGSTPrice: cgstPrice.toFixed(3),
          SGSTPrice: sgstPrice.toFixed(3),
          ProductName: data.Product_Name
        })
      }
      else
        return data;
    });

    this.setState({ currentBill: udpatedProduct });
   
  }
  changeProduct(rowindex,e) {
    e.preventDefault();
    //let value = e.target.value;
    //alert(this.state.currentBill.length);
    let udpatedProduct = this.state.currentBill.map(data => {
      if (data.rowIndex === rowindex) {
        let prod;
        
        this.state.productList.forEach(function (p) { if (p.ProductID.toString() === e.target.value) { prod = p; } });
        let totalGst = 0;
        let sGst,cGst, targetPrice, cgstPrice, sgstPrice,igstPrice;
        let basePrice =0.00;
        let qty = 0;
        let gstPrice =0;
        if(prod !== undefined){
        
          if(prod.IsIGSTEnabled)
          {
            totalGst = prod.IGST;
            sGst = 0;
            cGst = 0;          
            basePrice = (prod.TargetPrice / (1+(totalGst/100)));
            gstPrice =  (basePrice* (totalGst/100)) *qty;
            igstPrice = gstPrice;
            cgstPrice =0;
            sgstPrice =0;
          }
          else{
            sGst=  parseFloat(prod.SGST);
            cGst=  parseFloat(prod.CGST);          
            let gstvalue = (sGst/100) + (cGst/100);
            basePrice = prod.TargetPrice / (1+ gstvalue);
            gstPrice =  (basePrice * ((sGst/100) +(cGst/100))) * qty;
            igstPrice =0;
            cgstPrice = basePrice * (cGst/100);
            sgstPrice= basePrice *(sGst/100);
          }
          targetPrice = prod.TargetPrice;
        }
        else
        {
          sGst =0.00;
          cGst =0.00;
          basePrice =0.00
          gstPrice =  0.00
          igstPrice =0.00;
          cgstPrice = 0.00
          sgstPrice= 0.00;
          targetPrice = 0.00;
        }

        return Object.assign({}, data, {
          ProductID: e.target.value
          , BasePrice: basePrice.toFixed(3)
          , SGST:  sGst.toFixed(2)
          , CGST: cGst.toFixed(2)
          , Qty: 0,
          Total :0,
          IsIGSTEnabled:(prod !== undefined ? prod.IsIGSTEnabled : false),
          TargetPrice: targetPrice.toFixed(3),
          GstPrice : gstPrice.toFixed(3),
          IGSTPrice: igstPrice.toFixed(3),
          CGSTPrice: cgstPrice.toFixed(3),
          SGSTPrice: sgstPrice.toFixed(3),
          Unit: (prod !== undefined ? prod.Unit : '')
        })
      }
      else
        return data;
    });

    this.setState({ currentBill: udpatedProduct });
    
  }
  render() {
    let total = 0.00;
    this.state.currentBill.forEach(function(data) {
        total = parseFloat(total) + parseFloat(data.Total);
    });
    let selectedClientAddress;
    
    let clientInfo = this.state.clients.map((d) => {
      return <option value={d.id}> {d.name}</option>
    });
    let productInfo = this.state.productList.map(data => {
      return <option value={data.ProductID}>{data.Product_Name}</option>
    });
    let billInfo = this.state.currentBill.map(data => {
      return (
        <div className="row form-group">
           <div className="form-group col-sm-1">
            <label>{data.rowIndex}</label>
          </div>
          <div className="form-group col-sm-2">
            <select value={data.ProductID} className="form-control" onChange={this.changeProduct.bind(this,data.rowIndex)}>
              <option value="0">select</option>
              {productInfo}
            </select>
          </div>
          <div className="form-group col-sm-1 rightAlign">
            <label>{data.BasePrice}</label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
            <label>{data.SGSTPrice} {"("} {(data.SGST + "%")} {")"}  </label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
            <label>{ data.CGSTPrice} {"("} {  (data.CGST +"%")}  {")"} </label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
            <label>{ data.Unit}  </label>
          </div>
          
          <div className="form-group col-sm-1">
            <input className="form-control" value ={data.Qty} onChange ={this.changeQty.bind(this,data.rowIndex)}/>            
          </div>
          <div className="form-group col-sm-2 rightAlign">
            <label>{ data.GstPrice/2  } {" + "} {data.GstPrice/2 } {"="} {data.GstPrice/1} </label>
          </div>
          
          
          <div className="form-group col-sm-1 rightAlign">
            <label>{data.Total} </label>
          </div>
          <div className="form-group col-sm-1 centerAlign">
            <a href="#" onClick={this.deleteRow.bind(this, data.rowIndex)}>
              <span class="glyphicon glyphicon-minus"></span>
            </a>
          </div>
        </div>

      );
    });
    return (
      <div className="App">
        <header className="App-header">
          {/* <img src={logo} className="App-logo" alt="logo" /> */}
          <h1 className="App-title">Ponvandu Agencies</h1>
        </header>
        {/* <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p> */}
        <div className="content">
          <div className="container">
            <div className="row form-group">
              <div className="form-group col-sm-4">
                <label className="form-label">
                  Client
              </label>
                <select className="form-control" value={this.state.selectedClient.id} onChange={this.clientChange}>
                  <option value="0">select</option>
                  {clientInfo}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <p>Client Name: {this.state.selectedClient.name}</p>

          <p>GST: {this.state.selectedClient.GST_NO} </p>
       {/* <p>Address:</p>
       <p>{ this.state.selectedClient.AddressLine1}</p>
              <p> {this.state.selectedClient.AddressLine2}</p>
              <p> {this.state.selectedClient.AddressLine3}</p>
              <p> {this.state.selectedClient.City}</p>
              <p> {this.state.selectedClient.State}</p>
              <p> {this.state.selectedClient.Country}</p>
              <p> {this.state.selectedClient.Zipcode}</p> */}
  
            
          <hr />
          <a href="#" class="btn btn-info btn-sm toolsRight" onClick={this.addRow}>
          <span class="glyphicon glyphicon-plus" ></span>
        </a>
        
        <a href="#" class="btn btn-success btn-sm toolsRight" onClick={this.printBill}>
          <span class="glyphicon glyphicon-print"></span>  
        </a>
        </div>

        

        <div className="container">
        <div className="row form-group">
        <div className="form-group col-sm-1">
          <label>#</label>
          </div>
          <div className="form-group col-sm-2 leftAlign">
          <label>Product</label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
          <label>Base Price</label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
          <label>SGST</label>
          </div>
          <div className="form-group col-sm-1 rightAlign">
          <label>CGST</label>
          </div>
          <div className="form-group col-sm-1 centerAlign">
          <label>Unit</label>
          </div>
          <div className="form-group col-sm-1 centerAlign">
          <label>Qty</label>
          </div>

          <div className="form-group col-sm-2 rightAlign">
            <label>SGST + CGST Price </label>
          </div>
          
          
          <div className="form-group col-sm-1 centerAlign">
          <label>Total</label>
          </div>
          <div className="form-group col-sm-1 centerAlign">
            <label>Action</label>
          </div>
        </div>

          {billInfo}

          <div className="row form-group ">
              <div className ="form-group">
                <label> {"Total: "+  total.toFixed(2)} </label>
                </div>
            </div>
        </div>
        <div className="centerAlign">
          <span className="glyphicon glyphicon-copyright-mark"></span> Copyright 2017 Developed by Sasikumar
          </div>
      </div>

    );
  }
}

export default App;
