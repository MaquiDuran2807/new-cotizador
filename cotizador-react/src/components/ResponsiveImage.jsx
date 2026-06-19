import PropTypes from 'prop-types'

export default function ResponsiveImage({ srcSmall, srcLarge, alt, className, style, loading = 'lazy', decoding = 'async', imgRef, ...rest }) {
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={srcSmall} />
      <source media="(min-width: 768px)" srcSet={srcLarge || srcSmall} />
      <img
        ref={imgRef}
        src={srcLarge || srcSmall}
        alt={alt}
        className={className}
        style={style}
        loading={loading}
        decoding={decoding}
        {...rest}
      />
    </picture>
  )
}

ResponsiveImage.propTypes = {
  srcSmall: PropTypes.string,
  srcLarge: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  loading: PropTypes.string,
  decoding: PropTypes.string,
  imgRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
}
