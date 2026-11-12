import {jsPDF} from 'jspdf';
import type {AppData} from '../types';
import {lessons} from '../data/lessons';
import {siteConfig} from '../config/siteConfig';

const font64=async(name:string)=>{const b=new Uint8Array(await(await fetch(`${import.meta.env.BASE_URL}fonts/${name}`)).arrayBuffer());let s='';for(let i=0;i<b.length;i+=32768)s+=String.fromCharCode(...b.subarray(i,i+32768));return btoa(s)};

function cutCorner(doc:jsPDF,x:number,y:number,flipX:number,flipY:number){doc.setDrawColor(153,78,30);doc.setLineWidth(.55);for(let i=0;i<4;i++){const d=i*3;doc.line(x+flipX*d,y,x+flipX*18,y+flipY*(18-d));doc.circle(x+flipX*(21+d),y+flipY*(4+d),1.1)}doc.setDrawColor(234,88,12);doc.setLineWidth(.35);doc.line(x,y+flipY*22,x+flipX*22,y)}

function laserSeal(doc:jsPDF,cx:number,cy:number){doc.setFillColor(15,91,94);doc.circle(cx,cy,17,'F');doc.setFillColor(246,183,82);doc.circle(cx,cy,13.5,'F');doc.setFillColor(255,247,226);doc.circle(cx,cy,10.5,'F');doc.setDrawColor(15,91,94);doc.setLineWidth(.7);for(let a=0;a<360;a+=30){const r=a*Math.PI/180;doc.line(cx+Math.cos(r)*11.5,cy+Math.sin(r)*11.5,cx+Math.cos(r)*15.5,cy+Math.sin(r)*15.5)}doc.setFillColor(15,91,94);doc.roundedRect(cx-5.5,cy-5,cx?11:11,7,1,1,'F');doc.setFillColor(234,88,12);doc.rect(cx-.8,cy+2,1.6,6,'F');doc.setDrawColor(234,88,12);doc.setLineWidth(.5);doc.line(cx,cy+8,cx-4,cy+11);doc.line(cx,cy+8,cx+4,cy+11)}

function woodBackground(doc:jsPDF){doc.setFillColor(255,248,232);doc.rect(0,0,297,210,'F');doc.setDrawColor(238,218,181);doc.setLineWidth(.18);for(let y=6;y<207;y+=7){const offset=Math.sin(y*.22)*5;doc.line(0,y,65+offset,y+.8);doc.line(71+offset,y+.8,160-offset,y);doc.line(166-offset,y,297,y+.5)}doc.setFillColor(15,91,94);doc.rect(0,0,297,7,'F');doc.setFillColor(234,88,12);doc.rect(0,7,297,2,'F')}

export async function downloadCertificate(data:AppData,id?:number){
  if(!data.student)return;
  const date=id?data.lessons[`lesson-${id}`]?.completedAt:data.course.completedAt;
  if(!date)return;
  const doc=new jsPDF({orientation:'landscape',unit:'mm',format:'a4'});
  doc.addFileToVFS('Arial.ttf',await font64('arial.ttf'));
  doc.addFileToVFS('ArialBold.ttf',await font64('arialbd.ttf'));
  doc.addFont('Arial.ttf','Arial','normal');doc.addFont('ArialBold.ttf','Arial','bold');
  woodBackground(doc);
  doc.setDrawColor(153,78,30);doc.setLineWidth(1.1);doc.roundedRect(9,13,279,187,4,4);
  doc.setDrawColor(246,183,82);doc.setLineWidth(.45);doc.roundedRect(12,16,273,181,3,3);
  cutCorner(doc,17,22,1,1);cutCorner(doc,280,22,-1,1);cutCorner(doc,17,191,1,-1);cutCorner(doc,280,191,-1,-1);
  doc.setFont('Arial','bold');doc.setFontSize(10);doc.setTextColor(15,91,94);doc.text('LASER LAB  •  GRADE 9',148.5,25,{align:'center'});
  doc.setDrawColor(234,88,12);doc.setLineWidth(.5);doc.line(92,29,205,29);
  doc.setFontSize(27);doc.setTextColor(22,64,67);doc.text(id?'CHỨNG NHẬN HOÀN THÀNH':'CHỨNG NHẬN LASER LAB MAKER',148.5,47,{align:'center'});
  doc.setFont('Arial','normal');doc.setFontSize(11);doc.setTextColor(122,77,42);doc.text(id?'CERTIFICATE OF LESSON COMPLETION':'MASTER COURSE CERTIFICATE',148.5,56,{align:'center'});
  laserSeal(doc,48,78);laserSeal(doc,249,78);
  doc.setFontSize(11);doc.setTextColor(91,77,61);doc.text('Trân trọng chứng nhận học sinh',148.5,71,{align:'center'});
  doc.setFont('Arial','bold');doc.setFontSize(25);doc.setTextColor(15,91,94);doc.text(data.student.fullName,148.5,88,{align:'center'});
  doc.setDrawColor(246,183,82);doc.setLineWidth(.6);doc.line(88,93,209,93);
  doc.setFont('Arial','normal');doc.setFontSize(11);doc.setTextColor(91,77,61);doc.text(`Lớp ${data.student.className} đã hoàn thành`,148.5,104,{align:'center'});
  doc.setFont('Arial','bold');doc.setFontSize(16);doc.setTextColor(122,57,22);const course=id?`BÀI ${id} • ${lessons[id-1].title.toUpperCase()}`:'THIẾT KẾ VÀ CẮT LASER • LASER DESIGN & FABRICATION';doc.text(course,148.5,119,{align:'center',maxWidth:190});
  if(id){doc.setFontSize(10);doc.setTextColor(15,91,94);doc.text(`HUY HIỆU: ${lessons[id-1].badge.toUpperCase()}`,148.5,130,{align:'center'})}
  const ds=new Intl.DateTimeFormat('vi-VN').format(new Date(date));const code=`LL-${data.student.className}-${id||'MASTER'}-${new Date(date).getTime().toString(36).toUpperCase()}`;
  doc.setDrawColor(153,78,30);doc.setLineWidth(.35);doc.line(42,151,112,151);doc.line(185,151,255,151);
  doc.setFont('Arial','normal');doc.setFontSize(9);doc.setTextColor(91,77,61);doc.text(ds,77,146,{align:'center'});doc.text('Ngày hoàn thành',77,157,{align:'center'});doc.text(siteConfig.school,220,146,{align:'center',maxWidth:66});doc.text('Đơn vị xác nhận',220,157,{align:'center'});
  doc.setFillColor(15,91,94);doc.roundedRect(63,166,171,14,3,3,'F');doc.setTextColor(255);doc.setFont('Arial','bold');doc.setFontSize(9);doc.text(`MÃ ĐỐI CHIẾU • ${code}`,148.5,175,{align:'center'});
  doc.setFont('Arial','normal');doc.setFontSize(8);doc.setTextColor(122,77,42);doc.text(`Năm học ${siteConfig.year}  •  Xác nhận nội dung trực tuyến, không thay thế đánh giá sản phẩm trên Canvas.`,148.5,190,{align:'center'});
  doc.save(`laser-lab-${id?`bai-${id}`:'master'}.pdf`)
}
