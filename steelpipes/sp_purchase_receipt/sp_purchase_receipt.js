function calculate_weight_um(frm){
    var total_weight_um_temp        = frm.doc.loaded_vehicle_weight_um - frm.doc.empty_vehicle_weight_um;
    var estimate_weight_um_temp         = 0;
    var total_scale_weight_um_temp      = 0;
    var weight_difference_um_temp       = 0;
    var weight_difference_percentage_um = 0;

    for (var i in frm.doc.items){
        estimate_weight_um_temp     += frm.doc.items[i].total_weight_um;
        total_scale_weight_um_temp  += frm.doc.items[i].total_scale_weight_um;   
    }

    weight_difference_um_temp           = total_weight_um_temp - estimate_weight_um_temp;
    weight_difference_percentage_um     = (weight_difference_um_temp/estimate_weight_um_temp)*100;


    frm.set_value('estimate_weight_um',estimate_weight_um_temp);
    frm.set_value('total_weight_um',total_weight_um_temp);
    frm.set_value('weight_difference_um', weight_difference_um_temp);
    frm.set_value('weight_difference_percentage_um', weight_difference_percentage_um);
    frm.set_value('total_scale_weight_um', total_scale_weight_um_temp);
}

frappe.ui.form.on("Purchase Receipt", {
empty_vehicle_weight_um: function(frm){
    calculate_weight_um(frm); 
},

loaded_vehicle_weight_um: function(frm){
    calculate_weight_um(frm);
},

update_weight_calculations_um: function(frm){
    calculate_weight_um(frm);
}

})