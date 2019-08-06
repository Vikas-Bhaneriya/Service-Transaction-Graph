define(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'text!Data/data.json',
        'ojs/ojknockout', 'ojs/ojbutton', 'ojs/ojchart', 'ojs/ojbutton'],
    function (ko, Bootstrap, ArrayDataProvider, ServerData) {

        function ViewModel() {
            var self = this;
            self.clickedButton = ko.observable("mixedFreguency");
            self.buttonClick = function (event) {
                document.getElementById("lineChart2").setAttribute("time-axis-type", event.currentTarget.id + "");
                self.clickedButton(event.currentTarget.id);
            }.bind(self);

            var currentDateTime = new Date();
            var offset = new Date().getTimezoneOffset()
            var BackDateTime = new Date(Date.parse(currentDateTime) - 43*24* 60 * 60 * 1000 - offset*60*1000);

            // the above line code will be changed
            // moved 43 days back so that the given data can be used (25 jun 2019)
            // we need to move 6 hours back as such
            // if we want time to start from p hour back then put (p* 60 * 60 * 1000) in place  (43 * 24 * 60 * 60 * 1000)
            // (43 * 24 * 60 * 60 * 1000)milliseconds will be replaced with (6 * 60 * 60 * 1000)milliseconds to move 6 hours back

            var _data = JSON.parse(ServerData);
            var modData = [];
            for (i = 0; _data[i]; i++) {

                 var daAfterOffset= new Date(BackDateTime.getTime()+ offset*60*1000);

                modData.push({

                    'serviceType': _data[i]['serviceType'],
                    'count': 0,
                    'transactionRequestDateTime': daAfterOffset.toISOString()
                });
                for (j = 0; _data[i]['transactions'][j]; j++) {

                    var dateAfetrOffset= new Date(Date.parse(_data[i]['transactions'][j]['transactionRequestDateTime']) + offset*60*1000);

                    if (Date.parse(_data[i]['transactions'][j]['transactionRequestDateTime']) > Date.parse(BackDateTime)) {

                        modData.push({
                            'serviceType': _data[i]['serviceType'],
                            'count': _data[i]['transactions'][j]['count'],
                            'transactionRequestDateTime': dateAfetrOffset.toISOString()
                        });

                    }
                }
            }

            this.dataProvider = new ArrayDataProvider(modData, {keyAttributes: 'serviceType'});
        }

        return new ViewModel();
    }
);
