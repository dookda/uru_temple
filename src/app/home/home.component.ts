import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import * as Highcharts from 'highcharts';
import { DataService } from '../data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public map: L.Map;
  public center: any;
  public zoom: any;

  public grod: any;
  public gter: any;
  public ghyb: any;
  public mbox: any;

  public tName: any = '';

  public tNamet: any = '';
  public marker: any;
  public lyrGroup: any;
  public imgArr: any;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    this.loadMap();
  }

  async loadMap() {
    this.map = new L.Map('map', {
      center: [17.73, 100.55],
      zoom: 9
    });

    const mbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy;',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoiY3NrZWxseSIsImEiOiJjamV1NTd1eXIwMTh2MzN1bDBhN3AyamxoIn0.Z2euk6_og32zgG6nQrbFLw'
    });

    const grod = L.tileLayer('http://{s}.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const ghyb = L.tileLayer('http://{s}.google.com/vt/lyrs=y,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    const gter = L.tileLayer('http://{s}.google.com/vt/lyrs=t,m&x={x}&y={y}&z={z}', {
      maxZoom: 18,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });

    // overlay map
    const cgiUrl = 'http://www.cgi.uru.ac.th/geoserver/ows?';

    const pro = L.tileLayer.wms(cgiUrl, {
      layers: 'th:province_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53'
    });

    const amp = L.tileLayer.wms(cgiUrl, {
      layers: '	th:amphoe_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53'
    });

    const tam = L.tileLayer.wms(cgiUrl, {
      layers: 'th:tambon_4326',
      format: 'image/png',
      transparent: true,
      zIndex: 5,
      CQL_FILTER: 'pro_code=53'
    });

    this.lyrGroup = L.layerGroup();

    const baseLayers = {
      'map box': mbox,
      'แผนที่ถนน': grod,
      'แผนที่ภาพดาวเทียม': ghyb,
      'แผนที่ภูมิประเทศ': gter.addTo(this.map),
    };

    const overlayLayers = {
      'สถานีวัดน้ำฝน': this.lyrGroup.addTo(this.map),
      'ขอบเขตตำบล': tam.addTo(this.map),
      'ขอบเขตอำเภอ': amp.addTo(this.map),
      'ขอบเขตจังหวัด': pro.addTo(this.map)
    };
    new L.Control.Layers(baseLayers, overlayLayers).addTo(this.map);

    const geojsonMarkerOptions = {
      radius: 8,
      fillColor: '#ff0000',
      color: '#5b0000',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    };

    const icon = L.icon({
      iconUrl: 'http://cgi.uru.ac.th/marker/circus.png',
      iconSize: [32, 37],
      iconAnchor: [12, 37],
      popupAnchor: [5, -30]
    });

    await this.dataService.getTemple().then((res: any) => {
      this.marker = L.geoJSON(res, {
        pointToLayer: function (feature: any, latlng: any) {
          return L.marker(latlng, {
            icon: icon,
            properties: feature.properties.latitude,
            iconName: 'da'
          });
        },
        onEachFeature: (feature: any, layer: any) => {
          if (feature.properties) {
            layer.bindPopup(
              'ชื่อ: ' + feature.properties.wat + '</br>'
            );
          }
        }
      });
      this.lyrGroup.addLayer(this.marker);
      this.marker.on('click', (e: any) => {
        const tName = e.layer.feature.properties.wat;
        this.getImage(tName);
      });
    });

  }

  getImage(e) {
    console.log(e);
    let imgCount;
    if (e === 'วัดใหญ่ท่าเสา') {
      this.tName = 'yaithasao';
      this.tNamet = 'วัดใหญ่ท่าเสา';
      imgCount = 50;
    } else if (e === 'วัดพระฝางสวางคมุนี') {
      this.tName = 'prafang';
      this.tNamet = 'วัดพระฝางสวางคมุนี';
      imgCount = 104;
    } else if (e === 'อนุสาวรีย์พระยาพิชัยดาบหัก') {
      this.tName = 'payapichai';
      this.tNamet = 'อนุสาวรีย์พระยาพิชัยดาบหัก';
      imgCount = 8;
    } else if (e === 'วัดท่าถนน') {
      this.tName = 'thatanoon';
      this.tNamet = 'วัดท่าถนน';
      imgCount = 10;
    } else if (e === 'วัดพระยืน') {
      this.tName = 'payean';
      this.tNamet = 'วัดพระยืน';
      imgCount = 6;
    } else if (e === 'วัดพระแท่นศิลาอาสน์') {
      this.tName = 'pratansilaart';
      this.tNamet = 'วัดพระแท่นศิลาอาสน์';
      imgCount = 76;
    } else if (e === 'วัดพระบรมธาตุทุ่งยั้ง') {
      this.tName = 'tungyang';
      this.tNamet = 'วัดพระบรมธาตุทุ่งยั้ง';
      imgCount = 18;
    } else if (e === 'วัดบ้านแก่งใต้ พระอกแตก') {
      this.tName = 'kengtai';
      this.tNamet = 'วัดบ้านแก่งใต้ พระอกแตก';
      imgCount = 20;
    } else if (e === 'วัดขวางชัยภูมิ') {
      this.tName = 'khangchaiyaphoom';
      this.tNamet = 'วัดขวางชัยภูมิ';
      imgCount = 80;
    } else if (e === 'วัดมหาธาตุ') {
      this.tName = 'mahathat';
      this.tNamet = 'วัดมหาธาตุ';
      imgCount = 5;
    } else if (e === 'วัดหน้าพระธาตุ') {
      this.tName = 'napahat';
      this.tNamet = 'วัดหน้าพระธาตุ';
      imgCount = 10;
    } else if (e === 'บ้านเกิดพระยาพิชัย อนุสรณ์สถาน') {
      this.tName = 'payapichai_home';
      this.tNamet = 'บ้านเกิดพระยาพิชัย อนุสรณ์สถาน';
      imgCount = 10;
    } else if (e === 'วัดน้ำพี้') {
      this.tName = 'namphee';
      this.tNamet = 'วัดน้ำพี้';
      imgCount = 36;
    } else if (e === 'วัดปากถ้ำฉลอง') {
      this.tName = 'pakhuichalong';
      this.tNamet = 'วัดปากถ้ำฉลอง';
      imgCount = 74;
    } else if (e === 'วัดศรีสะอาดโพธิ์ชัย') {
      this.tName = 'srisaartphochai';
      this.tNamet = 'วัดศรีสะอาดโพธิ์ชัย';
      imgCount = 46;
    } else if (e === 'วัดกกต้อง') {
      this.tName = 'koktong';
      this.tNamet = 'วัดกกต้อง';
      imgCount = 52;
    } else if (e === 'วัดโพธิ์ชัยศรี') {
      this.tName = 'phochaisri';
      this.tNamet = 'วัดโพธิ์ชัยศรี';
      imgCount = 312;
    }

    this.imgArr = [];

    for (let i = 1; i < imgCount; i++) {
      this.imgArr.push('http://cgi.uru.ac.th/wat_img/out/' + this.tName + '/img (' + i + ').jpg');
    }

  }

}
