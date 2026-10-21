from pathlib import Path
# Architectural diagrams, deliberately illustrative rather than project blueprints.
for rooms in range(4):
 for variant in range(3):
  w=264+variant*12; left=28; top=22; bottom=254; right=left+w
  split=top+134+variant*5; parts=[]
  def rect(x,y,w,h,fill='#eee9df',stroke='#401f28',sw=2):parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
  def line(x1,y1,x2,y2,c='#401f28',sw=3):parts.append(f'<path d="M{x1} {y1}H{x2}" stroke="{c}" stroke-width="{sw}"/>' if y1==y2 else f'<path d="M{x1} {y1}L{x2} {y2}" stroke="{c}" stroke-width="{sw}"/>')
  def label(x,y,t):parts.append(f'<text x="{x}" y="{y}" text-anchor="middle" fill="#71615e" font-family="Arial,sans-serif" font-size="9">{t}</text>')
  def door(x,y):parts.append(f'<path d="M{x} {y}v-21a21 21 0 0 1 21 21" fill="none" stroke="#b88955" stroke-width="1.3"/>')
  rect(left,top,w,bottom-top,'#faf7f1','#401f28',4)
  # Low contrast room shading, restrained furniture and mint window glazing.
  n=max(1,rooms);bw=w/n
  for i in range(n):
   x=left+i*bw
   rect(x+3,top+3,bw-6,split-top-6,'#eee9df','none',0)
   if i:line(x,top,x,split)
   line(x+bw*.22,top,x+bw*.78,top,'#b5d1d4',5)
   if rooms==0:
    rect(x+18,top+24,65,39,'#e2d5c3','#b88955',1);rect(x+23,top+28,18,27,'#faf7f1','#b88955',.7)
    rect(x+w-65,top+25,38,67,'#e2d5c3','#b88955',1);rect(x+w-60,top+30,28,15,'#faf7f1','#b88955',.7)
    label(x+bw/2,split-23,'Жилая зона')
   else:
    if i==0 and rooms>1:
     rect(x+12,top+22,bw-24,28,'#e2d5c3','#b88955',1)
     rect(x+16,top+22,bw-32,7,'#faf7f1','#b88955',.7)
     parts.append(f'<circle cx="{x+bw/2}" cy="{top+76}" r="12" fill="#eee9df" stroke="#b88955"/>')
    else:
     bed=min(43,bw*.45);rect(x+12,top+20,bed,62,'#e2d5c3','#b88955',1);rect(x+16,top+24,bed-8,14,'#faf7f1','#b88955',.7)
    label(x+bw/2,split-25,'Гостиная' if i==0 and rooms>1 else 'Спальня')
  line(left,split,right,split)
  for i in range(n):
   x=left+i*bw+bw*.65;line(x,split,x+22,split,'#faf7f1',5);door(x,split)
  bath=right-67;line(bath,split,bath,bottom)
  rect(bath+9,split+9,45,20,'#eee9df','#b88955',1);rect(bath+11,split+38,16,22,'#eee9df','#b88955',1)
  label(bath+34,bottom-11,'С/у')
  k=left+int(w*.44);line(k,split,k,bottom)
  rect(left+8,split+8,k-left-16,15,'#e2d5c3','#b88955',1)
  parts.append(f'<circle cx="{left+36}" cy="{split+49}" r="12" fill="#eee9df" stroke="#b88955"/>')
  label(left+(k-left)/2,bottom-11,'Кухня')
  label(k+(bath-k)/2,split+40,'Холл')
  for partition in [k,bath]:
   line(partition,split+43,partition,split+65,'#faf7f1',5)
   parts.append(f'<path d="M{partition} {split+65}h-22a22 22 0 0 1 22-22" fill="none" stroke="#b88955" stroke-width="1.2"/>')
  entrance=k+15;line(entrance,bottom,entrance+24,bottom,'#faf7f1',6);door(entrance,bottom)
  parts.append(f'<path d="M{entrance+12} 281v-14m-4 4 4-4 4 4" stroke="#b88955" fill="none"/>')
  svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 300" role="img"><title>Демонстрационная схема: {"студия" if rooms==0 else str(rooms)+"-комнатная"}, вариант {variant+1}</title>'+''.join(parts)+'</svg>'
  Path(f'public/media/plans/demo-{rooms}-{variant+1}.svg').write_text(svg)
