function PropertyBinder() {}

PropertyBinder.copy = function(target, src) {
    for (var p in src) {
        try {
            if ( src[p].constructor==Object ) {
                target[p] = PropertyBinder.copy(target[p], src[p]);

            } else {
               target[p] = src[p];
            }
        } catch(e) {
            target[p] = src[p];
        }
    }

    return target;
}