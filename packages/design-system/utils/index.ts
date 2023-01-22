import type { ScaleValue } from '@stitches/react'

const stitchesUtils = {
  m: (value: number | string | ScaleValue<'space'>) => ({
    marginBottom: value,
    marginLeft: value,
    marginRight: value,
    marginTop: value,
  }),
  mb: (value: number | string | ScaleValue<'space'>) => ({
    marginBottom: value,
  }),
  ml: (value: number | string | ScaleValue<'space'>) => ({
    marginLeft: value,
  }),
  mr: (value: number | string | ScaleValue<'space'>) => ({
    marginRight: value,
  }),
  mt: (value: number | string | ScaleValue<'space'>) => ({
    marginTop: value,
  }),
  mx: (value: number | string | ScaleValue<'space'>) => ({
    marginLeft: value,
    marginRight: value,
  }),
  my: (value: number | string | ScaleValue<'space'>) => ({
    marginTop: value,
    marginBottom: value,
  }),
  p: (value: number | string | ScaleValue<'space'>) => ({
    paddingBottom: value,
    paddingLeft: value,
    paddingRight: value,
    paddingTop: value,
  }),
  pb: (value: number | string | ScaleValue<'space'>) => ({
    paddingBottom: value,
  }),
  pl: (value: number | string | ScaleValue<'space'>) => ({
    paddingLeft: value,
  }),
  pr: (value: number | string | ScaleValue<'space'>) => ({
    paddingRight: value,
  }),
  pt: (value: number | string | ScaleValue<'space'>) => ({
    paddingTop: value,
  }),
  px: (value: number | string | ScaleValue<'space'>) => ({
    paddingLeft: value,
    paddingRight: value,
  }),
  py: (value: number | string | ScaleValue<'space'>) => ({
    paddingTop: value,
    paddingBottom: value,
  }),
}

export default stitchesUtils
