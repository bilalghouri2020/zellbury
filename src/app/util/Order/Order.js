

import delivered from "../../../../media/delivered.gif";
import packed from "../../../../media/packed.gif";
import shipped from "../../../../media/shipped.gif";
import Success from "../../../../media/double-tick.gif";

export const getMessageFromStatus = (status, userName,routeObj={}) => {
    if (status.toLowerCase() == 'confirmed' || status.toLowerCase() == 'success') {
        return { title: `GREAT CHOICE ${userName}`, image: Success, message: 'Once your order is shipped, we\'ll notify you on WhatsApp' };
    }
    //  else if (status.toLowerCase() == 'pending') {
    //     return { title: `GREAT CHOICE ${userName}`, message: `Your order is pending <br /> Once confirmed we'll notify you` };
    // } 
    else if (status.toLowerCase() == 'processing') {
        return { image: packed, title: `WELCOME BACK ${userName}`, message: `Your order is packed. Once shipped we'll notify on WhatsApp` };
    } else if (status.toLowerCase() == 'shipped') {
        return { image: shipped, title: `GET READY ${userName}`, message: `Your order is on your way. Tap to track your order` };
    } else if (status.toLowerCase() == 'complete') {
        return { image: delivered, title: `TIME FOR A SELFIE`, message: `Your order has been delivered.` };
    }
    else {
        return { image: undefined,title:`YOUR ORDER IS ${status.toUpperCase()}`, message: `${routeObj.response_code?"Response Code " +routeObj.response_code+".": ""} ${routeObj.customMessage}`}
    }
};
export const checkRenderDetails = (status) => {
    if(status.toLowerCase() !== 'confirmed' && status.toLowerCase() !== 'success' && status.toLowerCase() !== 'pending' && status.toLowerCase() !== 'processing' && status.toLowerCase() !== 'shipped' && status.toLowerCase() !== 'complete')
    {
        return false;
    }
    else
    {
        return true;
    }
}
export const formateDotedDate =(d) =>{
    var arr = d.split('.')
    return new Date(`${arr[2]}-${arr[1]}-${arr[0]}T00:00:00`);
}
export const getExpectedDate = (d) => {
    let monthNames = ["Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"];
    let date;
    if (typeof(d) == "string" && d.indexOf('.') > -1) {
        date = formateDotedDate(d);
    }
    else if(typeof(d) == "string" && d.indexOf('.') == -1)
    {
        date=new Date(d.replace(/\s/, 'T'));
    }
    else
    {
        date=new Date(d);
    }
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let monthName = monthNames[monthIndex];

    let fromDate = ` ${day} ${monthName} `
    date.setDate(date.getDate() + 2);
    day = date.getDate();
    monthIndex = date.getMonth();
    monthName = monthNames[monthIndex];
    let toDate = ` ${day} ${monthName} `
    return ` ${fromDate}-${toDate}`;
}
export const DateFormatter = {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    formatDate: function (date, format) {
      var self = this;
      //date.replace(/\s/, 'T');
      format = self.getProperDigits(format, /d+/gi, date.getDate());
      format = self.getProperDigits(format, /M+/g, date.getMonth() + 1);
      format = format.replace(/y+/gi, function (y) {
        var len = y.length;
        var year = date.getFullYear();
        if (len == 2)
          return (year + "").slice(-2);
        else if (len == 4)
          return year;
        return y;
      })
      format = self.getProperDigits(format, /H+/g, date.getHours());
      format = self.getProperDigits(format, /h+/g, self.getHours12(date.getHours()));
      format = self.getProperDigits(format, /m+/g, date.getMinutes());
      format = self.getProperDigits(format, /s+/gi, date.getSeconds());
      format = format.replace(/a/ig, function (a) {
        var amPm = self.getAmPm(date.getHours())
        if (a === 'A')
          return amPm.toUpperCase();
        return amPm;
      })
      format = self.getFullOr3Letters(format, /d+/gi, self.dayNames, date.getDay())
      format = self.getFullOr3Letters(format, /M+/g, self.monthNames, date.getMonth())
      return format;
    },
    getProperDigits: function (format, regex, value) {
      return format.replace(regex, function (m) {
        var length = m.length;
        if (length == 1)
          return value;
        else if (length == 2)
          return ('0' + value).slice(-2);
        return m;
      })
    },
    getHours12: function (hours) {
      return (hours + 24) % 12 || 12;
    },
    getAmPm: function (hours) {
      return hours >= 12 ? 'pm' : 'am';
    },
    getFullOr3Letters: function (format, regex, nameArray, value) {
      return format.replace(regex, function (s) {
        var len = s.length;
        if (len == 3)
          return nameArray[value].substr(0, 3);
        else if (len == 4)
          return nameArray[value];
        return s;
      })
    }
  }