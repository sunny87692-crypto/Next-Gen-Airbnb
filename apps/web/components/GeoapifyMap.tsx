        if (!cancelled) {
          setGeoPoints(
            Object.fromEntries(
              resolvedEntries.flatMap(
                (entry): (readonly [string, GeoapifyPoint])[] => entry ? [entry] : []
              )
            )
          );
        }