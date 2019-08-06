define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'text!Data/data.json',
        'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojbutton'],
    function (ko, Bootstrap, ArrayDataProvider, quarterData) {

        function ViewModel() {
            var self = this;

            self.clickedButton = ko.observable("mixedFreguency");
            self.buttonClick = function (event) {
                document.getElementById("lineChart2").setAttribute("time-axis-type", event.currentTarget.id + "");
                self.clickedButton(event.currentTarget.id);
            }.bind(self);

            var currentDateTime = new Date();
     
            var BackDateTime = new Date(currentDateTime.getTime() - 43 * 24 * 60 * 60 * 1000);
            // the above line code will be changed
            // moved 38 days back so that the given data can be used (25 jun 2019)
            // we need to move 6 hours back as such
            // if we want time to start from p hour back then put (p* 60 * 60 * 1000) in place  (39 * 24 * 60 * 60 * 1000)
            // (39 * 24 * 60 * 60 * 1000)milliseconds will be replaced with (6 * 60 * 60 * 1000)milliseconds to move 6 hours back

           
            var _data = JSON.parse(quarterData);
            var modData = [];

            for (i = 0; _data[i]; i++) {

                modData.push({

                    'serviceType': _data[i]['serviceType'],
                    'count': 0,
                    'transactionRequestDateTime': BackDateTime.toISOString()
                });
                for (j = 0; _data[i]['transactions'][j]; j++) {
                    if (Date.parse(_data[i]['transactions'][j]['transactionRequestDateTime']) > Date.parse(BackDateTime)) {
                        modData.push({
                            'serviceType': _data[i]['serviceType'],
                            'count': _data[i]['transactions'][j]['count'],
                            'transactionRequestDateTime': _data[i]['transactions'][j]['transactionRequestDateTime']
                        });

                    }
                }
            }
            this.dataProvider = new ArrayDataProvider(modData, {keyAttributes: 'serviceType'});
        }

        return new ViewModel();
    }
);
