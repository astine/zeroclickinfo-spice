! function (f) {
    var c = 46,
        b = 7,
        g = "@",
        e = {
            item: "places_item"
        };
    var a = f.Views.Tabs.Base;
    f.Views.Tabs.Churches = function (m) {
        a.call(this, m)
    };
    f.Views.Tabs.Churches.prototype = $.extend({}, a.prototype, {
        template: "maps",
        append: function (n) {
            if (!n || !n.data || !n.data.length) {
                return
            }
            if (!this.meta && !is_mobile) {
                this._createMetaBar($.extend({
                    count: n.data.length
                }, n.meta))
            }
            if (!this.tiles) {
                this._createTileView()
            }
            var o;
            for (var m = 0; m < n.data.length; m++) {
                o = n.data[m];
                o.num = this.items.length + 1;
                this.items.push(o)
            }
            this.tiles.append({
                data: n.data,
                templates: n.templates
            });
            this.meta && this.meta.updateCount(this.items.length)
        },
        show: function () {
            a.prototype.show.call(this);
            this.tiles && this.tiles.show();
            this.meta && this.meta.show()
        },
        hide: function () {
            a.prototype.hide.call(this);
            this.tiles && this.tiles.hide()
        },
        resize: function () {
            a.prototype.resize.call(this);
            this.map && this.map.resize();
            this.tiles && this.tiles.resize();
            if (this._isExpanded) {
                this._fitToExpandedMapHeight()
            }
        },
        _createTileView: function () {
            if (this.tiles) {
                return
            }
            this.tiles = new f.Views.Tabs.Tiles({
                id: this.id + "-local",
                expand: false,
                dontScrollToSelectedTile: true,
                appendTo: this.$el
            });
            this.$el.addClass("has-tileview");
            this.tiles.on("click", this._onTileClick.bind(this));
            this.tiles.on("mouseenter", this._onTileMouseEnter.bind(this));
            this.tiles.on("mouseleave", this._onTileMouseLeave.bind(this));
            this.tiles.on("scrolled", this._onTilesScroll.bind(this))
        },
        _createMap: function () {
            if (this.map) {
                return
            }
            this.map = new f.Views.Maps.Map({
                appendTo: this.$el
            });
            if (is_mobile) {
                this.$mobileClose = $('<a href="#" class="mapview__close">Ã—</a>');
                this.$el.append(this.$mobileClose);
                this.$mobileClose.on("touch click", this._onMobileCloseClick.bind(this))
            }
            this.items.map(function (m) {
                this.map.addLocationAsMarker(m, {
                    canFocus: true
                })
            }, this);
            this.map.on("selected", this._onMapLocationSelected.bind(this));
            this.map.on("unselected", this._onMapLocationUnselected.bind(this));
            this.map.resetZoom()
        },
        _createMetaBar: function (m) {
            this.meta = new f.Views.Meta.MetaBar({
                tabId: this.id,
                count: m.count,
                itemType: "Churches",
                sourceName: m.sourceName,
                sourceUrl: m.sourceUrl,
                sourceIcon: true,
                expandModeIcon: g,
                minItemsForModeSwitch: 1,
                appendTo: this.$el
            });
            this.meta.on("mode:change", this._onMetaModeChange.bind(this))
        },
        _expand: function () {
            if (this._isExpanded) {
                return
            }
            clearTimeout(this._hideTimeout);
            this._collapseHeight = this.$el.outerHeight();
            this.$el.css({
                height: this._collapseHeight + "px"
            });
            if (!this.map) {
                this._createMap()
            }
            this.$el.addClass("is-expanded");
            this._isExpanded = true;
            var m = b + c;
            if (this.meta) {
                m += this.meta.getHeight()
            }
            this.map.setPadding({
                top: m,
                bottom: this.tiles && this.tiles.getHeight()
            });
            this.map.expand();
            this.map.show();
            this.map.enableScrollWheel();
            this._fitToExpandedMapHeight()
        },
        _collapse: function () {
            var m = this;
            this.$el.css({
                height: this._collapseHeight + "px"
            });
            this.map.collapse();
            this.map.hideControls();
            this.map.disableScrollWheel();
            this._hideTimeout = setTimeout(function () {
                m.$el.removeClass("is-expanded");
                m._isExpanded = false;
                m.map.showControls();
                m.map.hide()
            }, DDG.animation_speed)
        },
        _fitToExpandedMapHeight: function () {
            if (this._isExpanded) {
                this.$el.css({
                    height: this.map.getHeight() + "px"
                })
            }
        },
        _updateMarkers: function (p) {
            if (!this.tiles || !this.items) {
                return
            }
            p = p || this.tiles.getTilesByLocation(true);
            for (var n = 0, o; o = this.items[n]; n++) {
                if (o.marker) {
                    var m = (p.visible.indexOf(o) > -1) ? "pin" : "dot";
                    o.marker.setType(m);
                    if (m === "dot") {
                        o.marker.closePopup()
                    }
                }
            }
        },
        _onMapLocationSelected: function (m) {
            if (this.tiles) {
                this.tiles.selectTile(m, true)
            }
        },
        _onMapLocationUnselected: function (m) {
            if (this.tiles) {
                this.tiles.selectTile(m, false)
            }
        },
        _onTileClick: function (n, m) {
            if (m.target && m.target.localName === "a") {
                return true
            }
            this._expand();
            this.meta && this.meta.updateMode("expanded");
            this.map && this.map.select(n, {
                silent: true
            })
        },
        _onTileMouseEnter: function (n, m) {
            this.map && this.map.focus(n, {
                popup: false
            })
        },
        _onTileMouseLeave: function (n, m) {
            this.map && this.map.unfocus(n)
        },
        _onTilesScroll: function (m) {
            this._updateMarkers(m)
        },
        _onMetaModeChange: function (m) {
            if (m === "expanded") {
                this._expand()
            } else {
                this._collapse()
            }
        },
        _onMobileCloseClick: function (m) {
            m.preventDefault();
            this._collapse()
        }
    })
}(DDG);
 
function  ddg_spice_mass_on_time (api_result) {

     if (api_result.error) return;

    var details = api_result['query-details'];

    // Check the URL if we passed in the "current" word.
    // This says if we should check for relevancy or not.
    var script = $('[src*="/js/spice/mass_on_time/"]')[0];
    var source = $(script).attr("src");

    var generate_header = function (query_details) {
	var type;
	//Convert the query type to plural and capitalize
	if (query_details.type == "mass") {
	  type = "Masses";
	} else if (query_details.type == "parish") {
	  type = "Parishes";
	} else if (query_details.type == "any") {
	  type = "Services";
	} else {
	  type = query_details.type.charAt(0).toUpperCase() + query_details.type.slice(1) + "s";
	}

	return type;
    };

    //Parishes return different info than events, so a different template is in order for those
    var pick_item_template = function (query_details) {
	if (query_details.type == "parish") {
	  return Spice.mass_on_time.parish;
	} else {
	  return Spice.mass_on_time.events;
	}
    };

    //Return if service couldn't find the address given
    if (details.location.lat == 0 && details.location.lng == 0) return;

    //Filter results with no address
    var results = [];
    for(var i = api_result.results.length - 1; i >= 0; i--) {
	var result = api_result.results[i];
	// Check if it's the current location. If it is, don't check the relevancy.
	if (result.address !== null && result.address !== "" &&
	    (/current$/.test(source) || DDG.stringsRelevant(details.address, result.formateaddress))) {
	    results.unshift(result);
	}
    }

     results = $.map(results, function (item, index) {
	 item.coordinates = { longitude: item.lng,
			      latitude: item.lat
			    };
	 item.boosted = 0;
	 item.url = "http://massontime.com/parish/" + item.id; 
	 item.title = item.churchname;
	 item.neighborhood = "";
	 item.hours = null;
	 item.image = "http://massontime.com/images/hlchapel.png";
	 item.footing = "Mass On Time";
	 item.rating = null;
	 item.index = index+1;
	 
	 return item;
     });

    if (results.length < 1) return;
    
    DDG.duckbar.future_signal_tab({from: 'maps'});
    
    DDG.templates.churches_item = Spice.mass_on_time.church;
    
    DDG.require("maps", DDG.duckbar.add.bind(DDG.duckbar, {
        name: "churches",
        from: "maps",
	model: "Location",
     	view: "Churches",
	templates: {
	    item: pick_item_template(details)
	},
     	meta: {
     	    sourceName: 'Mass On Time',
     	    sourceUrl: 'http://massontime.com/nearest/' + details.type +
     		"/25?lat=" + details.location.lat + "&lng=" + details.location.lng
     	},
        data: results
    }))
  

    // Spice.add({
    // 	id: 'mass2',
    // 	name: generate_header(details) + " Map",
    // 	data: results,
    // 	//name: "Parishes",
    // 	from: 'maps',
    // 	meta: {
    // 	    sourceName: "Mass On Time",
    // 	    sourceUrl: 'http://massontime.com/nearest/' + details.type +
    // 			       "/25?lat=" + details.location.lat + "&lng=" + details.location.lng
    // 	},
    // 	view: 'Map',
    // 	model: 'Location',
    // 	allowMultipleCalls: true,
    // 	normalize: function(item) {
    // 	    return {
    // 		name: item.churchname,
    // 		url: item.webaddress,
    // 		address: item.address,
    // 		boundingBox: bounding_box,
    // 		coordinates:
    // 		{
    // 		    latitude: item.lat,
    // 		    longitude: item.lng
    // 		}
    // 	    };
    // 	},
    // 	templates: {
    // 	    group: 'base',
    // 	    options: {
    // 		content: pick_item_template(details)
    // 	    },
    // 	    detail: false
    // 	}
    // });
 };


  // ###  Handlebars Helpers ###


//Event types are returns as integers. This converts them to their string reps.
Handlebars.registerHelper( "MassOnTime_format_eventtypeid", function (eventtypeid) {
        var event_type_name = {
	  1 : "Adoration",
	  2 : "Confession",
	  3 : "Devotion",
	  5 : "Holy Day Mass",
	  6 : "Holy Day Mass (Vigil)",
	  7 : "Weekday Mass",
	  8 : "Weekend Mass"
	};
	return event_type_name[eventtypeid] || "Service";
});

Handlebars.registerHelper( "MassOnTime_backup_link", function (webaddress, parish_id) {
        return "http://massontime.com/parish/" + parish_id;
});

Handlebars.registerHelper( "MassOnTime_format_parish_address", function (address, city, province) {
	if (address && city && province) {
          return address + ", " + city + ", " + province;
        } else if (address && city) {
          return address + ", " + city;
        } else if (address) {
          return address;
	} else {
	  return "";
	}
});
