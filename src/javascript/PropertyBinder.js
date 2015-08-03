function PropertyBinder() {}

PropertyBinder.copy = function(src, target) {
    for (var p in src) {
        try {
            if ( src[p].constructor==Object ) {
                target[p] = PropertyBinder.copy(src[p], target[p]);

            } else {
               target[p] = src[p];
            }
        } catch(e) {
            target[p] = src[p];
        }
    }

    return target;
}